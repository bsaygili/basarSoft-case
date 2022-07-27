const fs = require("fs/promises");
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

app.get("/points", (req, res) => {
  res.status(200).json({
    id: "1",
    location: "Ankara",
    lat: "121325.12151",
    long: "5465465.54556",
  });
});

app.post("/points/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // if (!content) {
  //   return res.sendStatus(400);
  // }
  await fs.writeFile("db.json", content);
  res.status(201).json({ id });
});

app.listen(PORT, () =>
  console.log(`API Server is running on port: http://localhost:${PORT}`)
);
