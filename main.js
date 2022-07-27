var _Map, _Draw, _Source, _Layer, _Feaures;

InitializeMap = () => {
  _Source = new ol.source.Vector({ wrapX: false });

  _Layer = new ol.layer.Vector({
    source: _Source,
  });

  _Map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
      _Layer,
    ],
    view: new ol.View({
      center: [3875337.272593909, 4673762.797695817],
      zoom: 7,
    }),
  });
};

AddInteraction = () => {
  _Draw = new ol.interaction.Draw({
    source: _Source,
    type: "Point",
  });

  _Map.addInteraction(_Draw);

  _Draw.setActive(false);

  _Draw.on("drawend", (_event) => {
    console.log(_event.feature.getGeometry().getCoordinates());
    modalAP.style.display = "block";
    latitudeInput.value = _event.feature.getGeometry().getCoordinates()[0];
    longitudeInput.value = _event.feature.getGeometry().getCoordinates()[1];
    _Draw.setActive(false);
  });
};

AddPoint = () => {
  _Draw.setActive(true);
};

let marker = new ol.Marker([3875337.272593909, 4673762.797695817]);
marker.addTo(_Map);

// api url
const api_url = "http://localhost:3001/points";

// get add point modal element AP=AddPoint QP=QueryPoint
var modalAP = document.querySelector("#addPointModal");
var modalQP = document.querySelector("#queryPointModal");
// get close button element
var closeBtn = document.querySelector("#closeButton");
var closeBtnQuery = document.querySelector("#closeButtonQuery");
// query point link
var queryPointLink = document.querySelector("#queryPoint");
// get ID input
var idInput = document.getElementById("id-text");
// get location input
var locationInput = document.getElementById("location-name");
// get latitude input
var latitudeInput = document.getElementById("lat-text");
// get longitude input
var longitudeInput = document.getElementById("long-text");
//get form element
var form = document.getElementById("form");

//listen for submit
form.addEventListener("submit", (event) => {
  validetInputs();
  modalAP.style.display = "none";
  // locationInput.value = "";
  event.preventDefault();
});
//get save and leave button
var saveBtn = document.querySelector("#saveButton");

var place;
function saveData(event) {
  place = {
    id: Number(idInput.value),
    location: locationInput.value.trim(),
    lat: Number(latitudeInput.value),
    long: Number(longitudeInput.value),
  };
  event.preventDefault();
  postData(place);
}

async function postData(place) {
  const payload = JSON.stringify(place);
  await fetch(`${api_url}/${place.id}`, {
    method: "POST",
    body: payload,
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log("data", data))
    .catch((err) => console.log("err", err));
}

// set error messages
const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");
  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};
// set success messages
const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");
  errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

// check inputs for validating
const validetInputs = () => {
  const placeId = idInput.value.trim();
  const locName = locationInput.value.trim();
  const latValue = latitudeInput.value.trim();
  const longValue = longitudeInput.value.trim();

  if (placeId === "" && typeof placeId == "number") {
    setError(idInput, "Location is required must be integer");
  } else {
    setSuccess(idInput);
  }
  if (locName === "") {
    setError(locationInput, "Location is required");
  } else {
    setSuccess(locationInput);
  }
  if (latValue === "") {
    setError(latitudeInput, "Latiude is required");
  } else {
    setSuccess(latitudeInput);
  }
  if (longValue === "") {
    setError(longitudeInput, "Longitude is required");
  } else {
    setSuccess(longitudeInput);
  }
};

//listen for click close button
closeBtn.addEventListener("click", modalPointClose);
closeBtnQuery.addEventListener("click", modalQueryClose);
//listen for outside click
window.addEventListener("click", outsideClick);

// function to close modalAddPoint
function modalPointClose() {
  modalAP.style.display = "none";
}
// function to close modalQueryPoint
function modalQueryClose() {
  modalQP.style.display = "none";
}
// funtcion for outsideClick
function outsideClick(event) {
  if (event.target == modalAP) {
    modalPointClose();
  } else if (event.target == modalQP) {
    modalQueryClose();
  }
}
queryPointLink.addEventListener("click", () => {
  modalQP.style.display = "block";
});

// Query Point process
// Populate Table and its elements
//get table element
const table = document.querySelector("#table_data");
// Query Point function for loadIntoTable
async function loadIntoTable(url, table) {
  const tableHead = table.querySelector("thead");
  const tableBody = table.querySelector("tbody");
  const response = await fetch(url);
  const { data } = await response.json();

  tableBody.innerHTML = `<tr></tr>`;
  // populate the rows
  for (let i = 0; i < data.places.length; i++) {
    const rowElement = document.createElement("tr");
    tableBody.innerHTML += `
                          <tr>
                            <td scope="col">${data.places[i]["id"]}</td>
                            <td scope="col">${data.places[i]["location"]}</td>
                            <td scope="col">${data.places[i]["lat"]}</td>
                            <td scope="col">${data.places[i]["long"]}</td>
                        </tr>`;

    tableBody.appendChild(rowElement);
  }
}

loadIntoTable(api_url, document.querySelector("table"));

// Search elements process
// get search-input element
const inputSearch = document.getElementById("search-text");
function searchTable() {
  var filter, found, table, tr, td, i, j;
  filter = inputSearch.value.toUpperCase();
  table = document.getElementById("table_data");
  tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    for (j = 0; j < td.length; j++) {
      if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
        found = true;
      }
    }
    if (found) {
      tr[i].style.display = "";
      found = false;
    } else {
      tr[i].style.display = "none";
    }
  }
}
inputSearch.addEventListener("keyup", searchTable);
saveBtn.addEventListener("click", saveData);
