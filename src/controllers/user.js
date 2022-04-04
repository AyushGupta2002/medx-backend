const { response } = require("express");
const express = require("express");
const Pool = require("pg").Pool;
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/user");
const { pool } = require("../../pool_connection");
const { TABLE_NAMES, SCHEMA_NAME } = require("../utilities/constants");

User.schemaFuncs();

router.post("/create", (req, res) => {
  const Query = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.userDetails} VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`;
  const id = crypto.randomBytes(16).toString("hex");
  const {
    firstname,
    middlename,
    lastname,
    idType,
    idNumber,
    age,
    ageGroup,
    gender,
    nationality,
    email,
    mobileNumber,
    primary_occupation,
    secondary_occupation,
    language,
    marital_status,
    service_access,
  } = req.body;
  pool.query(
    Query,
    [
      id,
      firstname,
      middlename,
      lastname,
      idType,
      idNumber,
      age,
      ageGroup,
      gender,
      nationality,
      email,
      mobileNumber,
      primary_occupation,
      secondary_occupation,
      language,
      marital_status,
      service_access
    ],
    (error, results) => {
      res.json({ response: "user created successfully" });
    }
  );
});

module.exports = router;
