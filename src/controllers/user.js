const { response } = require("express");
const express = require("express");
const Pool = require("pg").Pool;
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/user");
const { pool } = require("../../pool_connection");
const { TABLE_NAMES, SCHEMA_NAME } = require("../utilities/constants");

User.schemaFuncs();

                       /**
                        * API for creating new user.
                        */
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


                /**
                 * API for getting details of all users.
                 */
router.get("/", (req, res) => {
  const Query = `SELECT * from ${SCHEMA_NAME}.${TABLE_NAMES.userDetails}`;
  pool.query(
    Query,
    (error, userDetails) => {
      res.json({ response: userDetails.rows });
    }
  );
});


                       /**
                        * API for getting details of particular user.
                        */
router.get("/:userId", (req, res) => {
  const requestedId = `'${req.params.userId}'`;
  const Query = `SELECT *
                 from ${SCHEMA_NAME}.${TABLE_NAMES.userDetails}
                 where user_id = ${requestedId}`;
  pool.query(
    Query,
    (error, userDetails) => {
      res.json({ response: userDetails.rows });
    }
  );
});


                       /**
                        * API for updating the details of a user.
                        */
router.put("/:userId", (req, res) => {

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

  const requestedId = req.params.userId;
  const Query = `UPDATE ${SCHEMA_NAME}.${TABLE_NAMES.userDetails}
                 SET firstname = $1,
                     middlename = $2,
                     lastname = $3,
                     idType = $4,
                     idNumber = $5,
                     age = $6,
                     ageGroup = $7,
                     gender = $8,
                     nationality = $9,
                     email = $10,
                     mobileNumber = $11,
                     primary_occupation = $12,
                     secondary_occupation = $13,
                     language = $14,
                     marital_status = $15,
                     service_access = $16
                WHERE user_id = $17`;
  pool.query(
    Query,
    [
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
      requestedId
    ],
    (error, result) => {
      res.json({ response : "User updated."});
    }
  );
});






module.exports = router;
