const { response } = require("express");
const express = require("express");
const Pool = require("pg").Pool;
const router = express.Router();
const crypto = require("crypto");
const Address = require("../models/address");
const { pool } = require("../../pool_connection");
const { TABLE_NAMES, SCHEMA_NAME } = require("../utilities/constants");

Address.schemaFuncs();

                       /**
                        * API for adding user's address.
                        */
router.post("/create", (req, res) => {

    const Query1 = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.address} VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
    const id = crypto.randomBytes(16).toString("hex");
    const { state, district, taluk, village, city, pincode, postoffice, isPermanent, isCurrent, userId } = req.body[0];
    pool.query(
      Query1,
      [id, state, district, taluk, village, city, pincode, postoffice, isPermanent, isCurrent, userId],
      (error, results) => {
        if (error) console.log(error);
      }
    );

  if (req.body.length === 2) {

    const Query2 = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.address} VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
    const id = crypto.randomBytes(16).toString("hex");
    const { state, district, taluk, village, city, pincode, postoffice, isPermanent, isCurrent, userId } = req.body[1];
    pool.query(
      Query2,
      [id, state, district, taluk, village, city, pincode, postoffice, isPermanent, isCurrent, userId],
      (error, results) => {
        if (error) console.log(error);
      }
    );
  }
  res.json({ response : "address added successfully"});
});

                /**
                 * API for getting all addresses.
                 */
router.get("/", (req, res) => {
  const Query = `SELECT * from ${SCHEMA_NAME}.${TABLE_NAMES.address}`;
  pool.query(
    Query,
    (error, addressDetails) => {
      res.json({ response: addressDetails.rows });
    }
  );
});

                       /**
                        * API for getting all addresses of a particular user.
                        */
router.get("/:userId", (req, res) => {
  const requestedId = `'${req.params.userId}'`;
  const Query = `SELECT *
                 from ${SCHEMA_NAME}.${TABLE_NAMES.address}
                 where user_id = ${requestedId}`;
  pool.query(
    Query,
    (error, addressDetails) => {
      res.json({ response: addressDetails.rows });
    }
  );
});

                       /**
                        * API for updating address of a user.
                        */
router.put("/:userId", (req, res) => {
  
})






module.exports = router;
