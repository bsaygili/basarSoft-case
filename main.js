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

// get add point modal elemnet AP=AddPoint
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
  fetch(`${api_url}/points`, {
    mode: "no-cors",
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((res) => console.log("res", res.json()))
    .then((data) => console.log("data", data))
    .catch((err) => console.log("err", err));
};
saveBtn.addEventListener("click", fetchData);
