
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
const { user } = require("pg/lib/defaults");

User.schemaFuncs();
Relative.schemaFuncs();
Education.schemaFuncs();
Address.schemaFuncs();

router.post("/create", async(req, res) => {

   let userQuery = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.userDetails} (user_id, firstname, middlename, lastname, idtype, idnumber, age, agegroup, gender, nationality, email, mobilenumber, primary_occupation, secondary_occupation, language, marital_status, service_access) VALUES `;
   let educationQuery = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.education} (education_id, category, school_name, school_passout_year, college_name, college_passout_year, highest_degree, highest_degree_passout, user_id) VALUES `;
   let addressQuery = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.address} (address_id, state, district, taluk, village, city, pincode, postoffice, ispermanent, iscurrent, user_id) VALUES `;
   let relativeQuery = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.relative} (relative_id, relation_type, firstname, middlename, lastname, gender, age, age_group, contact_number, user_id) VALUES `;


   req.body.forEach(user => {


    //completing userQuery
   
     const userId = crypto.randomBytes(16).toString("hex");
   
     const { firstname, middlename, lastname, idType, idNumber, age, ageGroup, gender, nationality,
             email, mobileNumber, primary_occupation, secondary_occupation, language, marital_status,
             service_access } = user.basic_details;
             
    let accessService = '{';
    service_access.forEach(el => {
      accessService = accessService + `"${el}", `;
    });
    if (service_access) {
      accessService = accessService.slice(0,-2);
    }
    accessService = accessService + '}';
   
    let  remUserQuery = `('${userId}', '${firstname}', '${middlename}', '${lastname}', '${idType}', '${idNumber}', ${age}, '${ageGroup}', '${gender}', '${nationality}', '${email}', ${mobileNumber}, '${primary_occupation}', '${secondary_occupation}', '${language}', '${marital_status}', '${accessService}' ), `;
    userQuery = userQuery + remUserQuery;  
   

   // completing educationQuery
   
   if (user.education_details) {

    const edu_id = crypto.randomBytes(16).toString("hex");

    const { category, school_name,  school_passout_year, college_name, college_passout_year,
      highest_degree, highest_degree_passout } = user.education_details;

    let  remEduQuery = `('${edu_id}', '${category}', '${school_name}', '${school_passout_year}', '${college_name}', '${college_passout_year}', ${highest_degree}, '${highest_degree_passout}', '${userId}' ), `;
    educationQuery = educationQuery + remEduQuery;
   }


   // completing addressQuery

   if (user.address_details) {

    user.address_details.forEach(address => {

      const address_id = crypto.randomBytes(16).toString("hex");

      const { state, district, taluk, village, city, pincode, postoffice, ispermanent, iscurrent } = address;

      let  remAddQuery = `('${address_id}', '${state}', '${district}', '${taluk}', '${village}', '${city}', ${pincode}, '${postoffice}', '${ispermanent}', '${iscurrent}', '${userId}' ), `;
      addressQuery = addressQuery + remAddQuery;

    });
   }


   //completing relativeQuery

   if (user.relative_details) {

    user.relative_details.forEach(relative => {

      const relative_id = crypto.randomBytes(16).toString("hex");

      const { relation_type, firstname, middlename, lastname, gender, age, age_group, contact_number } = relative;

      let  remRelativeQuery = `('${relative_id}', '${relation_type}', '${firstname}', '${middlename}', '${lastname}', '${gender}', ${age}, '${age_group}', ${contact_number}, '${userId}' ), `;
      relativeQuery = relativeQuery + remRelativeQuery;

    });
   }

  });

  const finalUserQuery = userQuery.slice(0,-2);
  const finalAddressQuery = addressQuery.slice(0,-2);
  const finalRelativeQuery = relativeQuery.slice(0,-2);
  const finalEducationQuery = educationQuery.slice(0,-2);

   const query = await pool.query(finalUserQuery, (e, result) => {
     if (e) console.log(e);
     else {

       const queryPromises = [pool.query(finalAddressQuery), pool.query(finalRelativeQuery), pool.query(finalEducationQuery)];

       Promise.all(queryPromises)
        .then((result) => {
       },
        error => console.log(error));
       }
   });

   res.json({response : "User added successfully."});

});




router.put("/update", (req, res) => {

  

});









module.exports = router;
