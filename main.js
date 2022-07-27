var _Map, _Draw, _Source, _Layer;

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

// get add point modal element AP=AddPoint QP=QueryPoint
var modalAP = document.querySelector("#addPointModal");
var modalQP = document.querySelector("#queryPointModal");
// get close button element
var closeBtn = document.querySelector("#closeButton");
var closeBtnQuery = document.querySelector("#closeButtonQuery");
//get save and leave button
var saveBtn = document.querySelector("#saveButton");
var queryPointLink = document.querySelector("#queryPoint");
// get location input
var locationInput = document.getElementById("location-name");
// get latitude input
var latitudeInput = document.getElementById("lat-text");
// get longitude input
var longitudeInput = document.getElementById("long-text");
//get form element
var form = document.getElementById("form");
// get search-input element
const input = document.getElementById("search-text");
//get table element
const table = document.querySelector("#table_data");

// Query Point function for loadIntoTable
async function loadIntoTable(url, table) {
  const tableHead = table.querySelector("thead");
  const tableBody = table.querySelector("tbody");
  const response = await fetch(url);
  const { data } = await response.json();
  console.log(Object.keys(data.places[5]).length);

  // clear table
  tableHead.innerHTML = `
  <tr>
    <th scope="col">#</th>
    <th scope="col">Name</th>
    <th scope="col">Latitude</th>
    <th scope="col">Longitude</th>
</tr>`;
  tableBody.innerHTML = `<tr></tr>`;
  // populate the rows
  for (let i = 0; i < data.places.length; i++) {
    const rowElement = document.createElement("tr");
    console.log(`test ${i}`, Object.keys(data.places[i]).length);
    for (let k = 0; k < Object.keys(data.places[i]).length; k++) {
      const cellElement = document.createElement("td");
      cellElement.textContent = "Bahadır";
      rowElement.appendChild(cellElement);
    }
    tableBody.appendChild(rowElement);
  }
}

loadIntoTable("http://localhost:3001/points", document.querySelector("table"));

//listen for submit
form.addEventListener("submit", (event) => {
  event.preventDefault();
  validetInputs();
  modalAP.style.display = "none";
  locationInput.value = "";
});

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
  const locName = locationInput.value.trim();
  const latValue = latitudeInput.value.trim();
  const longValue = longitudeInput.value.trim();

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

// request api
const api_url = "http://localhost:3001";
const fetchData = () => {
  fetch(`${api_url}/points`)
    .then((res) => res.json())
    .then((data) => console.log("data", data))
    .catch((err) => console.log("err", err));
};
saveBtn.addEventListener("click", fetchData);

function searchTable() {
  var filter, found, table, tr, td, i, j;
  filter = input.value.toUpperCase();
  table = document.getElementById("table_data");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
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
input.addEventListener("keyup", searchTable);
