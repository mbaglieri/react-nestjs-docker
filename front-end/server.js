const express = require("express");

const path = require("path");
const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  console.log("here")
  res.sendFile(path.join(__dirname, ".next/server/pages", "index.html"));
});

app.listen(PORT);

console.log("React Server is Running on PORT: ", PORT);
