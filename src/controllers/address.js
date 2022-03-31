const { response } = require("express");
const express = require("express");
const Pool = require("pg").Pool;
const router = express.Router();
const crypto = require("crypto");
const Address = require("../models/address");
const { pool } = require("../../pool_connection");
const { TABLE_NAMES, SCHEMA_NAME } = require("../utilities/constants");

Address.schemaFuncs();

router.post("/create", (req, res) => {
  const Query = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.address} VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
  const id = crypto.randomBytes(16).toString("hex");
  const { state, district, taluk, village, city, pincode, postoffice, isPermanent, isCurrent, userId } = req.body;
  pool.query(
    Query,
    [id, state, district, taluk, village, city, pincode, postoffice, isPermanent, isCurrent, userId],
    (error, results) => {
      res.json({ response: "user created successfully" });
    }
  );
});

router.get("/", (req, res) => {
  const Query = `SELECT * from ${SCHEMA_NAME}.${TABLE_NAMES.address}`;
  pool.query(
    Query,
    (error, addressDetails) => {
      res.json({ response: addressDetails.rows });
    }
  );
});

module.exports = router;
