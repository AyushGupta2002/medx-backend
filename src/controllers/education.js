const { response } = require("express");
const express = require("express");
const Pool = require("pg").Pool;
const router = express.Router();
const crypto = require("crypto");
const Education = require("../models/education");
const { pool } = require("../../pool_connection");
const { TABLE_NAMES, SCHEMA_NAME } = require("../utilities/constants");

Education.schemaFuncs();

router.post("/create", (req, res) => {
  const Query = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.education} VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
  const id = crypto.randomBytes(16).toString("hex");
  const {
    school_name,
    school_passout_year,
    college_name,
    college_passout_year,
    highest_degree,
    highest_degree_passout,
    user_id,
  } = req.body;
  pool.query(
    Query,
    [
      id,
      school_name,
      school_passout_year,
      college_name,
      college_passout_year,
      highest_degree,
      highest_degree_passout,
      user_id,
    ],
    (error, results) => {
      res.json({ response: "user created successfully" });
    }
  );
});

module.exports = router;
