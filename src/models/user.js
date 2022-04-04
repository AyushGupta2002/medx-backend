const { SCHEMA_NAME, POSTGRES_ROLE, SCHEMA_CODES } = require("../utilities/constants");
const { pool } = require("../../pool_connection");
const { TABLE_NAMES } = require("../utilities/constants");

async function schemaFuncs() {
  // Create the SCHEMA with user auth if it doesn't exist
  let createSql = `CREATE SCHEMA IF NOT EXISTS
  ${SCHEMA_NAME} AUTHORIZATION ${POSTGRES_ROLE};`;

  // Log the SQL statement to console
  console.log("\ncreateSql:", createSql);
  await pool.query(createSql, (createErr, createRes) => {
    if (createErr) {
      console.log("CREATE SCHEMA ERROR:", createErr.code, "--", SCHEMA_CODES[createErr.code]);
      console.log("ERROR code:", createErr.code);
      console.log("ERROR detail:", createErr.detail);
    }

    if (createRes) {
      console.log("\nCREATE SCHEMA RESULT:", createRes.command);

      let createTableSql = `CREATE TABLE ${SCHEMA_NAME}.${TABLE_NAMES.userDetails}(
        user_id TEXT primary key,
        firstname TEXT,
        middlename TEXT,
        lastname TEXT,
        idType TEXT,
        idNumber TEXT,
        age INT,
        ageGroup TEXT,
        gender TEXT,
        nationality TEXT,
        email TEXT,
        mobileNumber INT,
        primary_occupation TEXT,
        secondary_occupation TEXT,
        language TEXT,
        marital_status TEXT,
        service_access TEXT[]
      );`;

      console.log("\ncreateTableSql:", createTableSql);

      pool.query(createTableSql, (tableErr, tableRes) => {
        if (tableErr) {
          console.log("CREATE TABLE ERROR:", tableErr.code, "--", SCHEMA_CODES[tableErr.code]);
          console.log("createTableSql:", tableErr);
        }

        if (tableRes) {
          console.log("\nCREATE TABLE RESULT:", tableRes);
        }
      });
    }
  });
}

module.exports = {
  schemaFuncs,
};
