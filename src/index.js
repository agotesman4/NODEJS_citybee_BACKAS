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

app.get("/models", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`SELECT * FROM models`);

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).end({ error: "ERROR, PLEASE TRY AGAIN" });
  }
});
app.post("/models", async (req, res) => {
  if (
    !req.body.name ||
    !req.body.hour_price ||
    req.body.hour_price < 0 ||
    req.body.hour_price > 20
  ) {
    return res.status(400).send({ error: "WRONG DATA PASSED, PLEASE REENTER" });
  }
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const result = await con.execute(
      `INSERT INTO models (name, hour_price) VALUES (${mysql.escape(
        req.body.name
      )}, ${mysql.escape(req.body.hour_price)})`
    );
    res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "ERROR, PLEASE TRY AGAIN" });
  }
});

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
