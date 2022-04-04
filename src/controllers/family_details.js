const { response } = require("express");
const express = require("express");
const Pool = require("pg").Pool;
const router = express.Router();
const crypto = require("crypto");
const Relative = require("../models/family_details");
const { pool } = require("../../pool_connection");
const { TABLE_NAMES, SCHEMA_NAME } = require("../utilities/constants");

Relative.schemaFuncs();

router.post("/create", (req, res) => {
  const Query = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.relative} VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
  const id = crypto.randomBytes(16).toString("hex");
  const { relation_type, firstname, middlename, lastname, gender, age, age_group, contact_number, user_id } = req.body;
  pool.query(
    Query,
    [id, relation_type, firstname, middlename, lastname, gender, age, age_group, contact_number, user_id],
    (error, results) => {
      res.json({ response: "user created successfully" });
    }
  );
});

module.exports = router;
