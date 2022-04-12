
// const { response } = require("express");
const express = require("express");
const router = express.Router();
const Pool = require("pg").Pool;
const crypto = require("crypto");
const { TABLE_NAMES, SCHEMA_NAME } = require("../utilities/constants");
const { convertArrayToString } = require("../utilities/helpers");
const { pool } = require("../../pool_connection");
const Address = require("../models/address");
const Education = require("../models/education");
const Relative = require("../models/family_details");
const User = require("../models/user");
const Bank = require("../models/bank_details");
const Finance = require("../models/financial_details");
const Service = require("../models/service_access");
const Health = require("../models/health_history");

const { user } = require("pg/lib/defaults");

User.schemaFuncs();
Relative.schemaFuncs();
Education.schemaFuncs();
Address.schemaFuncs();
Bank.schemaFuncs();
Finance.schemaFuncs();
Service.schemaFuncs();
Health.schemaFuncs();

router.post("/create", async(req, res) => {


   let userQuery = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.userDetails} (user_id, firstname, middlename, lastname, idtype, idnumber, age, agegroup, gender, nationality, email, mobilenumber, primary_occupation, secondary_occupation, language, marital_status) VALUES `;
   let educationQuery = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.education} (education_id, category, school_name, school_passout_year, college_name, college_passout_year, highest_degree, highest_degree_passout, user_id) VALUES `;
   let addressQuery = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.address} (address_id, state, district, taluk, village, city, pincode, postoffice, ispermanent, iscurrent, user_id) VALUES `;
   let relativeQuery = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.relative} (relative_id, relation_type, firstname, middlename, lastname, gender, age, age_group, contact_number, user_id) VALUES `;
   let bankQuery = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.bank} (bank_id, bank_name, account_number, IFSC, branch_name, user_id) VALUES `;
   let financeQuery = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.finance} (finance_id, income_source, annual_income, monthly_income, user_id) VALUES `;
   let serviceQuery = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.service} (service_id, electricity, internet, cooking_gas, water, healthcare_center, school, govt_schemes, user_id) VALUES `;
   let healthQuery = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.health} (health_id, disabilities, injuries, suffer_from_diseases, habbits, suffer_from_medical_condition, allergies, childhood_diseases, ongoing_treatment, pregnant, covid_test, suffer_from_allergy, allergy_details, turned_down_for_insurance, family_member_have_issue, user_id) VALUES `;

   req.body.forEach(user => {


    //completing userQuery

     const userId = crypto.randomBytes(16).toString("hex");

     const { firstname, middlename, lastname, idType, idNumber, age, ageGroup, gender, nationality,
             email, mobileNumber, primary_occupation, secondary_occupation, language,
             marital_status } = user.basic_details;

    let  remUserQuery = `('${userId}', '${firstname}', '${middlename}', '${lastname}', '${idType}', '${idNumber}', ${age}, '${ageGroup}', '${gender}', '${nationality}', '${email}', ${mobileNumber}, '${primary_occupation}', '${secondary_occupation}', '${language}', '${marital_status}' ), `;
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


   // completing bankQuery

   if (user.bank_details) {

     const bank_id = crypto.randomBytes(16).toString("hex");

     const { bank_name, account_number, IFSC, branch_name } = user.bank_details;

     let  remBankQuery = `('${bank_id}', '${bank_name}', '${account_number}', '${IFSC}', '${branch_name}', '${userId}' ), `;
     bankQuery = bankQuery + remBankQuery;

   }


   // completing financeQuery

   if (user.finance_details) {

     const finance_id = crypto.randomBytes(16).toString("hex");

     const { income_source, annual_income, monthly_income } = user.finance_details;

     let  remFinanceQuery = `('${finance_id}', '${income_source}', '${annual_income}', '${monthly_income}', '${userId}' ), `;
     financeQuery = financeQuery + remFinanceQuery;

   }


   // completing serviceQuery

   if (user.service_access) {

     const service_id = crypto.randomBytes(16).toString("hex");

     const { electricity, internet, cooking_gas, water, healthcare_center, school, govt_schemes } = user.service_access;

     const govtSchemes = convertArrayToString(govt_schemes);

     let  remServiceQuery = `('${service_id}', '${electricity}', '${internet}', '${cooking_gas}', '${water}', '${healthcare_center}', '${school}', '${govtSchemes}', '${userId}' ), `;
     serviceQuery = serviceQuery + remServiceQuery;

   }

   // completing healthQuery

   if (user.health_history) {

     const health_id = crypto.randomBytes(16).toString("hex");

     const { disabilities, injuries, suffer_from_diseases, habbits, suffer_from_medical_condition,
         allergies, childhood_diseases, ongoing_treatment, pregnant, covid_test, suffer_from_allergy,
         allergy_details, turned_down_for_insurance, family_member_have_issue } = user.health_history;

     const disability = convertArrayToString(disabilities);
     const injury = convertArrayToString(injuries);
     const diseases = convertArrayToString(suffer_from_diseases);
     const habbit = convertArrayToString(habbits);
     const medical_condition = convertArrayToString(suffer_from_medical_condition);
     const allergy = convertArrayToString(allergies);
     const childhood_disease = convertArrayToString(childhood_diseases);

     let  remHealthQuery = `('${health_id}', '${disability}', '${injury}', '${diseases}', '${habbit}', '${medical_condition}', '${allergy}', '${childhood_disease}', '${ongoing_treatment}', '${pregnant}', '${covid_test}', '${suffer_from_allergy}', '${allergy_details}', '${turned_down_for_insurance}', '${family_member_have_issue}', '${userId}' ), `;
     healthQuery = healthQuery + remHealthQuery;

   }


  });

  const finalUserQuery = userQuery.slice(0,-2);
  const finalAddressQuery = addressQuery.slice(0,-2);
  const finalRelativeQuery = relativeQuery.slice(0,-2);
  const finalEducationQuery = educationQuery.slice(0,-2);
  const finalBankQuery = bankQuery.slice(0,-2);
  const finalFinanceQuery = financeQuery.slice(0,-2);
  const finalServiceQuery = serviceQuery.slice(0,-2);
  const finalHealthQuery = healthQuery.slice(0, -2);

   const query = await pool.query(finalUserQuery, (e, result) => {
     if (e) console.log(e);
     else {

       const queryPromises =  [
         pool.query(finalAddressQuery),
         pool.query(finalRelativeQuery),
         pool.query(finalEducationQuery),
         pool.query(finalBankQuery),
         pool.query(finalFinanceQuery),
         pool.query(finalServiceQuery),
         pool.query(finalHealthQuery)
       ];

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
