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
  const Query = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.education} VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
  const id = crypto.randomBytes(16).toString("hex");
  const {
    category,
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
      category,
      school_name,
      school_passout_year,
      college_name,
      college_passout_year,
      highest_degree,
      highest_degree_passout,
      user_id,
    ],
    (error, results) => {
      res.json({ response: "Education added successfully" });
    }
  );
});

router.get("/", (req, res) => {
  const Query = `SELECT * from ${SCHEMA_NAME}.${TABLE_NAMES.education}`;
  pool.query(
    Query,
    (error, educationDetails) => {
      res.json({ response: educationDetails.rows });
    }
  );
});

router.get("/:educationId", (req, res) => {
  const requestedId = `'${req.params.educationId}'`;
  const Query = `SELECT *
                 from ${SCHEMA_NAME}.${TABLE_NAMES.education}
                 where education_id = ${requestedId}`;
  pool.query(
    Query,
    (error, educationDetails) => {
      res.json({ response: educationDetails.rows });
    }
  );
});

router.put("/:educationId", (req, res) => {
  const requestedId = req.params.educationId;
  const {
    category,
    school_name,
    school_passout_year,
    college_name,
    college_passout_year,
    highest_degree,
    highest_degree_passout
  } = req.body;

  const Query = `UPDATE ${SCHEMA_NAME}.${TABLE_NAMES.education}
                 SET category = $1,
                     school_name = $2,
                     school_passout_year = $3,
                     college_name = $4,
                     college_passout_year = $5,
                     highest_degree = $6,
                     highest_degree_passout = $7
                WHERE education_id = $8`;
  pool.query(
    Query,
    [category,
    school_name,
    school_passout_year,
    college_name,
    college_passout_year,
    highest_degree,
    highest_degree_passout,
    requestedId],
    (error, result) => {
      res.json({ response : "Education status updated."});
    }
  );
});






module.exports = router;
