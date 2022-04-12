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

      let createTableSql = `CREATE TABLE ${SCHEMA_NAME}.${TABLE_NAMES.health}(
        health_id TEXT,
        disabilities TEXT[],
        injuries TEXT[],
        suffer_from_diseases TEXT[],
        habbits TEXT[],
        suffer_from_medical_condition TEXT[],
        allergies TEXT[],
        childhood_diseases TEXT[],
        ongoing_treatment TEXT,
        pregnant TEXT,
        covid_test TEXT,
        suffer_from_allergy TEXT,
        allergy_details TEXT,
        turned_down_for_insurance TEXT,
        family_member_have_issue TEXT,
        user_id TEXT,
        CONSTRAINT fk_${TABLE_NAMES.userDetails}
            FOREIGN KEY(user_id)
                REFERENCES ${SCHEMA_NAME}.${TABLE_NAMES.userDetails}(user_id)
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
