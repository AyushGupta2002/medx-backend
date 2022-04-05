
// const { response } = require("express");
const express = require("express");
const router = express.Router();
const Pool = require("pg").Pool;
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


















module.exports = router;
