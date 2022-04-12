require("dotenv").config();
const express = require("express");
const app = express();
const { BASE_URL, USER, ADDRESS, EDUCATION, RELATIVE, BANK, FINANCE, SERVICE, PINCODE, HEALTH, MAIN } = require("./src/utilities/routes");
const userPaths = require("./src/controllers/user");
const AddressPaths = require("./src/controllers/address");
const EducationPaths = require("./src/controllers/education");
const FamilyPaths = require("./src/controllers/family_details");
const BankPaths = require("./src/controllers/bank_details");
const FinancePaths = require("./src/controllers/financial_details");
const ServicePaths = require("./src/controllers/service_access");
const PincodePaths = require("./src/controllers/pincode_details");
const HealthPaths = require("./src/controllers/health_history");
const MainPaths = require("./src/controllers/main");
const { getUrl } = require("./src/utilities/helpers");


const Pool = require("pg").Pool;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// common handling of requests
app.use(BASE_URL, (req, res, next) => {
  console.info(req.method, req.url);
  next();
});

// Map Model paths with controllers
app.use(getUrl(USER), userPaths);
app.use(getUrl(ADDRESS), AddressPaths);
app.use(getUrl(EDUCATION), EducationPaths);
app.use(getUrl(RELATIVE), FamilyPaths);
app.use(getUrl(FINANCE), FinancePaths);
app.use(getUrl(SERVICE), ServicePaths);
app.use(getUrl(PINCODE), PincodePaths);
app.use(getUrl(HEALTH), HealthPaths);
app.use(getUrl(MAIN), MainPaths);
app.use(getUrl(BANK), BankPaths);

app.use((req, res) => {
  res.status(404);
  res.send({
    error: { message: "Sorry, this is an invalid URL" },
  });
});

console.log("App is now ready on localhost:3000");
app.listen(3000);
