const Pool = require("pg").Pool;
const { POSTGRES_ROLE } = require("./src/utilities/constants");

// Declare a new client instance from Pool()
const pool = new Pool({
  user: POSTGRES_ROLE,
  host: "medexchange.cyz55jfb64j8.ap-south-1.rds.amazonaws.com",
  database: "medx_beneficiary",
  password: "MedExchange",
  port: "5432",
});

module.exports = {
  pool,
};
