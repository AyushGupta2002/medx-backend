
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

    var queryPromises = [];

    req.body.forEach(user => {

      //updating basic details

      const { user_id, firstname, middlename, lastname, idType, idNumber, age, ageGroup, gender, nationality,
              email, mobileNumber, primary_occupation, secondary_occupation, language,
              marital_status } = user.basic_details;

       const userUpdateQuery = `UPDATE ${SCHEMA_NAME}.${TABLE_NAMES.userDetails}
                                SET  firstname = '${firstname}',
                                middlename = '${middlename}',
                                lastname = '${lastname}',
                                idType = '${idType}',
                                idNumber = '${idNumber}',
                                age = ${age},
                                gender = '${gender}',
                                ageGroup = '${ageGroup}',
                                nationality = '${nationality}',
                                email = '${email}',
                                mobileNumber = ${mobileNumber},
                                primary_occupation = '${primary_occupation}',
                                secondary_occupation = '${secondary_occupation}',
                                language = '${language}',
                                marital_status = '${marital_status}'
                                WHERE user_id = '${user_id}'`;

       queryPromises.push(pool.query(userUpdateQuery));


       //updating education details

       const { edu_id, category, school_name,  school_passout_year, college_name, college_passout_year,
         highest_degree, highest_degree_passout } = user.education_details;


         const educationUpdateQuery = `UPDATE ${SCHEMA_NAME}.${TABLE_NAMES.education}
                                       SET category = '${category}',
                                       school_name = '${school_name}',
                                       school_passout_year = '${school_passout_year}',
                                       college_name = '${college_name}',
                                       college_passout_year = '${college_passout_year}',
                                       highest_degree = ${highest_degree},
                                       highest_degree_passout = '${highest_degree_passout}'
                                       WHERE education_id = '${edu_id}'`;

        queryPromises.push(pool.query(educationUpdateQuery));


        // updating relative details

        user.relative_details.forEach(relative => {

          const { relative_id, relation_type, firstname, middlename, lastname, gender, age, age_group,
            contact_number } = relative;

          const relativeUpdateQuery = `UPDATE ${SCHEMA_NAME}.${TABLE_NAMES.relative}
                                       SET relation_type = '${relation_type}',
                                       firstname = '${firstname}',
                                       middlename = '${middlename}',
                                       lastname = '${lastname}',
                                       gender = '${gender}',
                                       age = ${age},
                                       age_group = '${age_group}',
                                       contact_number = ${contact_number}
                                       WHERE relative_id = '${relative_id}'`;

           queryPromises.push(pool.query(relativeUpdateQuery));
        });


        //updating bank details

        const { bank_id, bank_name, account_number, IFSC, branch_name } = user.bank_details;

        const bankUpdateQuery = `UPDATE ${SCHEMA_NAME}.${TABLE_NAMES.bank}
                                 SET bank_name = '${bank_name}',
                                 account_number = '${account_number}',
                                 IFSC = '${IFSC}',
                                 branch_name = '${branch_name}'
                                 WHERE bank_id = '${bank_id}'`;



       queryPromises.push(pool.query(bankUpdateQuery));


       //updating finance details

       const { finance_id, income_source, annual_income, monthly_income } = user.finance_details;

       const financeUpdateQuery = `UPDATE ${SCHEMA_NAME}.${TABLE_NAMES.finance}
                                   SET income_source = '${income_source}',
                                   annual_income = '${annual_income}',
                                   monthly_income = '${monthly_income}'
                                   WHERE finance_id = '${finance_id}'`;


       queryPromises.push(pool.query(financeUpdateQuery));


      //updating service details

      const { service_id, electricity, internet, cooking_gas, water, healthcare_center, school, govt_schemes } = user.service_access;

      const govtSchemes = convertArrayToString(govt_schemes);

      const serviceUpdateQuery = `UPDATE ${SCHEMA_NAME}.${TABLE_NAMES.service}
                                  SET electricity = '${electricity}',
                                  internet = '${internet}',
                                  cooking_gas = '${cooking_gas}',
                                  water = '${water}',
                                  healthcare_center = '${healthcare_center}',
                                  school = '${school}',
                                  govt_schemes = '${govtSchemes}'
                                  WHERE service_id = '${service_id}'`;


     queryPromises.push(pool.query(serviceUpdateQuery));


     //updating health details

     const { health_id, disabilities, injuries, suffer_from_diseases, habbits, suffer_from_medical_condition,
         allergies, childhood_diseases, ongoing_treatment, pregnant, covid_test, suffer_from_allergy,
         allergy_details, turned_down_for_insurance, family_member_have_issue } = user.health_history;

     const disability = convertArrayToString(disabilities);
     const injury = convertArrayToString(injuries);
     const diseases = convertArrayToString(suffer_from_diseases);
     const habbit = convertArrayToString(habbits);
     const medical_condition = convertArrayToString(suffer_from_medical_condition);
     const allergy = convertArrayToString(allergies);
     const childhood_disease = convertArrayToString(childhood_diseases);

     const healthUpdateQuery = `UPDATE ${SCHEMA_NAME}.${TABLE_NAMES.health}
                                SET disabilities = '${disability}',
                                injuries = '${injury}',
                                suffer_from_diseases = '${diseases}',
                                habbits = '${habbit}',
                                suffer_from_medical_condition = '${medical_condition}',
                                allergies = '${allergy}',
                                childhood_diseases = '${childhood_disease}',
                                ongoing_treatment = '${ongoing_treatment}',
                                pregnant = '${pregnant}',
                                covid_test = '${covid_test}',
                                suffer_from_allergy = '${suffer_from_allergy}',
                                allergy_details = '${allergy_details}',
                                turned_down_for_insurance = '${turned_down_for_insurance}',
                                family_member_have_issue = '${family_member_have_issue}'
                                WHERE health_id = '${health_id}'`;


      queryPromises.push(pool.query(healthUpdateQuery));


      // updating address details

      if (user.address_details.length === 1) {

        const { address_id, state, district, taluk, village, city, pincode, postoffice,
          ispermanent, iscurrent } = user.address_details[0];

        const addressUpdateQuery = `UPDATE ${SCHEMA_NAME}.${TABLE_NAMES.address}
                                    SET state = '${state}',
                                    district = '${district}',
                                    taluk = '${taluk}',
                                    village = '${village}',
                                    city = '${city}',
                                    pincode = '${pincode}',
                                    postoffice = '${postoffice}',
                                    ispermanent = '${ispermanent}',
                                    iscurrent = '${iscurrent}'
                                    WHERE address_id = '${address_id}'`;

        queryPromises.push(pool.query(addressUpdateQuery));
      }

      else {

        if ( (user.address_details[0].ispermanent && user.address_details[0].iscurrent) ||
             (user.address_details[1].ispermanent && user.address_details[1].iscurrent) ) {

          var ind, deleteInd;

          if (user.address_details[0].ispermanent && user.address_details[0].iscurrent) {
            ind = 0;
            deleteInd = 1;
          }
          else  {
            ind = 1;
            deleteInd = 0;
          }

          const { address_id, state, district, taluk, village, city, pincode, postoffice,
            ispermanent, iscurrent } = user.address_details[ind];

            const addressUpdateQuery = `UPDATE ${SCHEMA_NAME}.${TABLE_NAMES.address}
                                        SET state = '${state}',
                                        district = '${district}',
                                        taluk = '${taluk}',
                                        village = '${village}',
                                        city = '${city}',
                                        pincode = '${pincode}',
                                        postoffice = '${postoffice}',
                                        ispermanent = '${ispermanent}',
                                        iscurrent = '${iscurrent}'
                                        WHERE address_id = '${address_id}'`;

            queryPromises.push(pool.query(addressUpdateQuery));

            const deleteAddressQuery = `DELETE FROM ${SCHEMA_NAME}.${TABLE_NAMES.address}
                                        WHERE address_id = '${user.address_details[deleteInd].address_id}'`;

            queryPromises.push(pool.query(deleteAddressQuery));
        }

        else  {

        user.address_details.forEach(address => {

          const { state, district, taluk, village, city, pincode, postoffice, ispermanent,
            iscurrent } = address;

          if (address.address_id) {

            const addressUpdateQuery = `UPDATE ${SCHEMA_NAME}.${TABLE_NAMES.address}
                                        SET state = '${state}',
                                        district = '${district}',
                                        taluk = '${taluk}',
                                        village = '${village}',
                                        city = '${city}',
                                        pincode = '${pincode}',
                                        postoffice = '${postoffice}',
                                        ispermanent = '${ispermanent}',
                                        iscurrent = '${iscurrent}'
                                        WHERE address_id = '${address.address_id}'`;

            queryPromises.push(pool.query(addressUpdateQuery));

          }

          else {

            let createAddressQuery = `INSERT INTO ${SCHEMA_NAME}.${TABLE_NAMES.address} (address_id, state, district, taluk, village, city, pincode, postoffice, ispermanent, iscurrent, user_id)
                                      VALUES ('${address_id}', '${state}', '${district}', '${taluk}', '${village}', '${city}', ${pincode}, '${postoffice}', '${ispermanent}', '${iscurrent}', '${user.basic_details.user_id}' )`;

            queryPromises.push(pool.query(createAddressQuery));

          }
        });
      }
    }

  });

  Promise.all(queryPromises)
  .then((result) => {
 },
  error => console.log(error));

  res.json({ response : "User updated successfully." });



});









module.exports = router;
