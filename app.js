require("dotenv").config();
const express = require("express");
const app = express();
const { BASE_URL, USER, ADDRESS } = require("./src/utilities/routes");
const userPaths = require("./src/controllers/user");
const addressPaths = require("./src/controllers/address");
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
app.use(getUrl(ADDRESS), addressPaths);

app.use((req, res) => {
  res.status(404);
  res.send({
    error: { message: "Sorry, this is an invalid URL" },
  });
});

console.log("App is now ready on localhost:3000");
app.listen(3000);
