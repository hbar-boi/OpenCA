const http = require("http");
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use("/dist", express.static("node_modules/bootstrap-colorpicker/dist"))

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/index.html"));
});

const server = http.createServer(app);
const port = 3000;
server.listen(port);

console.log("========= OpenCA is running on port 3000 =========");
