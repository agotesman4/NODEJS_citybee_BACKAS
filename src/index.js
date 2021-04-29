const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const mysqlConfig = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT,
};

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({ message: "SERVER RUNS OK" });
});

app.get("/models", async (req, res) => {});
app.post("/models", async (req, res) => {});

app.get("/modelscount", async (req, res) => {});

app.get("/vehicles", async (req, res) => {});
app.post("/vehicles", async (req, res) => {});

app.get("/vehicles/lt", async (req, res) => {});
app.get("/vehicles/lv", async (req, res) => {});
app.get("/vehicles/ee", async (req, res) => {});

app.all("*", (req, res) => {
  res.status(404).send({ error: "PAGE WAS NOT FOUND" });
});
//  PORTAS
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`SITE WORKS ON PORT ${port}`));
