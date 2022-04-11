const { response } = require("express");
const express = require("express");
const Pool = require("pg").Pool;
const router = express.Router();
const crypto = require("crypto");
const Pincode = require("../models/pincode_details");
const { pool } = require("../../pool_connection");
const { TABLE_NAMES, SCHEMA_NAME } = require("../utilities/constants");

Pincode.schemaFuncs();

router.get("/:pincode", (req, res) => {

   const pincode = `'${req.params.pincode}'`;
   const Query = `SELECT *
                  from ${SCHEMA_NAME}.${TABLE_NAMES.pincode}
                  where pincode = ${pincode}`;
    pool.query(
     Query,
     (error, pincodeDetails) => {
       if (error) console.log(error);
       else res.json({ response: pincodeDetails.rows });
     }
   );

})

module.exports = router;
