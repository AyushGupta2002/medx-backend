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


router.get("/", (req, res) => {
  const Query = `SELECT * from ${SCHEMA_NAME}.${TABLE_NAMES.relative}`;
  pool.query(
    Query,
    (error, relativeDetails) => {
      res.json({ response: relativeDetails.rows });
    }
  );
});

router.get("/:id", (req, res) => {
  const requestedId = `'${req.params.id}'`;
  const Query = `SELECT *
                 from ${SCHEMA_NAME}.${TABLE_NAMES.relative}
                 where relative_id = ${requestedId}`;
  pool.query(
    Query,
    (error, relativeDetails) => {
      res.json({ response: relativeDetails.rows });
    }
  );
});

router.put("/:id", (req, res) => {
  const requestedId = req.params.id;
  const {
    relation_type,
    firstname,
    middlename,
    lastname,
    gender,
    age,
    age_group,
    contact_number
   } = req.body;


  const Query = `UPDATE ${SCHEMA_NAME}.${TABLE_NAMES.relative}
                 SET relation_type = $1,
                     firstname = $2,
                     middlename = $3,
                     lastname = $4,
                     gender = $5,
                     age = $6,
                     age_group = $7,
                     contact_number = $8
                WHERE relative_id = $9`;
  pool.query(
    Query,
    [relation_type,
    firstname,
    middlename,
    lastname,
    gender,
    age,
    age_group,
    contact_number,
    requestedId],
    (error, result) => {
      res.json({ response : "Family status updated."});
    }
  );
});



module.exports = router;
