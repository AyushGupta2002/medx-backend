
// const { response } = require("express");
const express = require("express");
const router = express.Router();
const Pool = require("pg").Pool;
const crypto = require("crypto");
const { TABLE_NAMES, SCHEMA_NAME } = require("../utilities/constants");
const { pool } = require("../../pool_connection");
const Address = require("../models/address");
const Education = require("../models/education");
const Relative = require("../models/family_details");
const User = require("../models/user");

User.schemaFuncs();
Relative.schemaFuncs();
Education.schemaFuncs();
Address.schemaFuncs();

router.get("/", async(req, res) => {

  const Query1 = `SELECT * from ${SCHEMA_NAME}.${TABLE_NAMES.userDetails}`;
  const Query2 = `SELECT * from ${SCHEMA_NAME}.${TABLE_NAMES.education}`;
  const Query3 = `SELECT * from ${SCHEMA_NAME}.${TABLE_NAMES.relative}`;
  const Query4 = `SELECT * from ${SCHEMA_NAME}.${TABLE_NAMES.address}`;

  const queryPromises = [pool.query(Query1), pool.query(Query2), pool.query(Query3), pool.query(Query4)];

  Promise.all(queryPromises)
  .then((result) => {
    var response = [];
    result.forEach(value => response.push(value.rows));
    res.json(response);
  },
   error => console.log(error));
});

router.get("/:userId", async(req, res) => {

  const requestedId = `'${req.params.userId}'`;

  const Query1 = `SELECT *
                 from ${SCHEMA_NAME}.${TABLE_NAMES.userDetails}
                 where user_id = ${requestedId}`;

  const Query2 = `SELECT *
                  from ${SCHEMA_NAME}.${TABLE_NAMES.education}
                  where user_id = ${requestedId}`;

  const Query3 = `SELECT *
                 from ${SCHEMA_NAME}.${TABLE_NAMES.relative}
                 where user_id = ${requestedId}`;

  const Query4 = `SELECT *
                  from ${SCHEMA_NAME}.${TABLE_NAMES.address}
                  where user_id = ${requestedId}`;

  const queryPromises = [pool.query(Query1), pool.query(Query2), pool.query(Query3), pool.query(Query4)];

  Promise.all(queryPromises)
  .then((result) => {
    console.log(result);
    var response = [];
    result.forEach(value => response.push(value.rows));
    res.json(response);
  },
   error => console.log(error));
});


router.post("/create", async(req, res) => {


  // create user
  const Query1 = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.userDetails} VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`;
  const id1 = crypto.randomBytes(16).toString("hex");

  const { firstname, middlename, lastname, idType, idNumber, age, ageGroup, gender,
          nationality, email, mobileNumber, primary_occupation, secondary_occupation,
          language, marital_status, service_access} = req.body[0];

  const values1 = [id1, firstname, middlename, lastname, idType, idNumber, age, ageGroup, gender,
                  nationality, email, mobileNumber, primary_occupation, secondary_occupation,
                  language, marital_status, service_access];

  // console.log({USER_DETAILS : values1});

  const createUser = await pool.query(Query1, values1,
    (e, result) => {
      if (e) console.log(e);
      else {
      // start
      let queryPromises = [];

      // add education details
      const Query2 = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.education} VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
      const id2 = crypto.randomBytes(16).toString("hex");

      const { category, school_name, school_passout_year, college_name, college_passout_year, highest_degree, highest_degree_passout } = req.body[1];
      const values2 = [id2, category, school_name, school_passout_year, college_name, college_passout_year, highest_degree, highest_degree_passout, id1];

      queryPromises.push(pool.query(Query2, values2));
      // console.log({EDUCATION_DETAILS : values2});

      // add address
      const Query3 = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.address} VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
      const id3 = crypto.randomBytes(16).toString("hex");

      const { state, district, taluk, village, city, pincode, postoffice, ispermanent, iscurrent } = req.body[2][0];
      const values3 = [id3, state, district, taluk, village, city, pincode, postoffice, ispermanent, iscurrent, id1];

      queryPromises.push(pool.query(Query3, values3));
      // console.log({FIRST_ADD_DETAILS : values3});

      if (req.body[2].length === 2) {

        const Query4 = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.address} VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
        const id4 = crypto.randomBytes(16).toString("hex");

        const { state, district, taluk, village, city, pincode, postoffice, ispermanent, iscurrent } = req.body[2][1];
        const values4 = [id4, state, district, taluk, village, city, pincode, postoffice, ispermanent, iscurrent, id1];

        queryPromises.push(pool.query(Query4, values4));
        // console.log({SECOND_ADD_DETAILS : values4});
      }


      // add family details
      if (req.body[3]) {
        const Query5 = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.relative} VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        const id5 = crypto.randomBytes(16).toString("hex");

        const { relation_type, firstname, middlename, lastname, gender, age, age_group, contact_number } = req.body[3];
        const values5 = [id5, relation_type, firstname, middlename, lastname, gender, age, age_group, contact_number, id1];

        queryPromises.push(pool.query(Query5, values5));
        // console.log({FAMILY_DETAILS : values5});
      }

      Promise.all(queryPromises)
      .then((result) => {
        res.json({response : "User created."});
      },
       error => console.log(error));

        // end
      }
  });
});












module.exports = router;
