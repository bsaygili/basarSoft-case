const fs = require("fs");
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());

app.post("/points/:id", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  var content = req.body;
  var { id } = req.params;

  if (!content) {
    res.json({
      success: false,
      data: "There is no content ",
    });
  }
  var { id, location, lat, long } = content;

  var data = fs.readFileSync("db.json", "utf-8");
  var points = JSON.parse(data);
  console.log("data", data);
  points.places.push({
    id,
    location,
    lat,
    long,
  });

  fs.writeFileSync("db.json", JSON.stringify(points), {
    encoding: "utf-8",
  });

  res.status(200).send({
    success: true,
    data: points,
  });
});

app.get("/points", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  var data = fs.readFileSync("db.json", "utf-8");
  var points = JSON.parse(data);
  res.status(200).send({
    success: true,
    data: points,
  });
});

app.listen(PORT, () =>
  console.log(`API Server is running on port: http://localhost:${PORT}`)
);
