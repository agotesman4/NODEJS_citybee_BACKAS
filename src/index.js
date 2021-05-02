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
// OK WORKS

app.get("/models", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`SELECT * FROM models`);

    con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).end({ error: "ERROR, PLEASE TRY AGAIN" });
  }
});
// OK WORKS
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
    const [result] = await con.execute(
      `INSERT INTO models (name, hour_price) VALUES 
      (${mysql.escape(req.body.name)}, 
      ${mysql.escape(req.body.hour_price)})`
    );
    con.end();

    if (!result.insertId) {
      return res.status(500).send({
        error: "MORTAL KOMBAT ERROR contact 112 for MORE INFO",
      });
    }
    return res.send({ id: result.insertId });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "ERROR, PLEASE TRY AGAIN" });
  }
});
// OK WORKS

app.get("/modelscount", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `SELECT name, COUNT(vehicles.model_id) AS COUNT, hour_price FROM models INNER JOIN vehicles ON vehicles.model_id = models.id GROUP by models.id`
    );

    con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).end({ error: "ERROR, PLEASE TRY AGAIN" });
  }
});
// OK WORKS

app.get("/vehicles", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `SELECT vehicles.id, models.name, vehicles.number_plate, models.hour_price + models.hour_price * 0.21 AS price_pvm, vehicles.country_location FROM vehicles INNER JOIN models ON vehicles.model_id = models.id`
    );

    con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).end({ error: "ERROR, PLEASE TRY AGAIN" });
  }
});
// OK WORKS

app.post("/vehicles", async (req, res) => {
  if (
    !req.body.model_id ||
    !req.body.number_plate ||
    !req.body.country_location ||
    req.body.country_location < 2 ||
    req.body.country_location > 2
  ) {
    return res.status(400).send({ error: "BAD DATA GIVEN" });
  }
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [result] = await con.execute(
      `INSERT INTO vehicles (model_id, number_plate, country_location,) VALUES (${mysql.escape(
        req.body.model_id
      )}, ${mysql.escape(req.body.number_plate)}, ${mysql.escape(
        req.body.country_location
      )})`
    );

    con.end();

    if (!result.insertId) {
      return res.status(500).send({
        error: "MORTAL KOMBAT ERROR contact 112 for MORE INFO",
      });
    }
    return res.send({ id: result.insertId });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "ERROR, TRY LATER" });
  }
});
// OK WORKS

app.get("/vehicles/lt", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `SELECT vehicles.id, models.name, vehicles.number_plate, models.hour_price + models.hour_price * 0.21 AS price_pvm, vehicles.country_location FROM vehicles INNER JOIN models ON vehicles.model_id = models.id AND vehicles.country_location = "LT"`
    );
    con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).end({ error: "ERROR, PLEASE TRY AGAIN" });
  }
});
app.get("/vehicles/lv", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `SELECT vehicles.id, models.name, vehicles.number_plate, models.hour_price + models.hour_price * 0.21 AS price_pvm, vehicles.country_location FROM vehicles INNER JOIN models ON vehicles.model_id = models.id AND vehicles.country_location = "LV"`
    );
    con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).end({ error: "ERROR, PLEASE TRY AGAIN" });
  }
});
app.get("/vehicles/ee", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `SELECT vehicles.id, models.name, vehicles.number_plate, models.hour_price + models.hour_price * 0.21 AS price_pvm, vehicles.country_location FROM vehicles INNER JOIN models ON vehicles.model_id = models.id AND vehicles.country_location = "EE"`
    );
    con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).end({ error: "ERROR, PLEASE TRY AGAIN" });
  }
});
// COUNTRY / WORKS FINE

app.all("*", (req, res) => {
  res.status(404).send({ error: "PAGE WAS NOT FOUND" });
});
//  PORTAS
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`SITE WORKS ON PORT ${port}`));
