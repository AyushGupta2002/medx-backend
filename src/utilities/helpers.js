const cryptoStr = require("@supercharge/strings");
const bcrypt = require("bcrypt");
const jbuilder = require("jbuilder");
const { ROLES } = require("./constants");
const { BASE_URL } = require("./routes");
const { findAndUpdateConfig, UPDATE_TYPES } = require("../utilities/constants");

const saltRounds = 10;

// Get API Url with base url
const getUrl = (url) => {
  return `${BASE_URL}${url}`;
};

// Get Admin API Url with base url
const getAdminUrl = (url) => {
  return `${BASE_URL}/admin${url}`;
};

// Check if current user is admin
const isAdmin = (roles) => {
  return roles && (roles.indexOf(ROLES.superadmin) > -1 || roles.indexOf(ROLES.admin) > -1);
};

// Generate a unique crypt string for Model ID
const generateCryptId = () => {
  const length = 25;
  return cryptoStr.random(length);
};

// Common handler for API response
const responseFormatter = (res, error, data, meta = null) => {
  if (error) {
    res.status(400);
    if (error.errors) {
      let errors = error.errors;
      let keyname = Object.keys(errors)[0];
      let resError = {};
      if (errors[keyname].kind == "required") {
        resError["message"] = errors[keyname].path + " is required";
      } else {
        resError["message"] = errors[keyname].path + " is invalid";
      }
      res.send({ error: resError });
    } else if (error.keyPattern) {
      let errors = error.keyPattern;
      let resError = { message: "This " + Object.keys(errors)[0] + " already exist" };
      res.send({ error: resError });
    } else if (error.message) {
      res.send({ error });
    } else {
      res.send({ error: { message: "Something went wrong" } });
    }
  } else {
    Promise.resolve(data).then((value) => {
      if (!value) {
        res.status(204);
        res.send({ data: null });
      } else {
        const response = { data: value };
        if (meta) {
          response.meta = {
            page: meta.page,
            limit: meta.limit,
            total_count: meta.total,
            total_pages: meta.pages,
          };
        }
        res.status(200);
        res.send(response);
      }
    });
  }
};

// Common handler for pagination config
const paginateConfig = (req, otherConfig) => {
  return {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
    ...otherConfig,
  };
};

// Common handler for Deleting records
const deleteRecord = (res, err) => {
  responseFormatter(res, err, { message: "Deletion successful" });
};

// Common handler for Updating records
const updateRecord = (res, err) => {
  responseFormatter(res, err, { message: "Updation successful" });
};

// Common handler for Creating records
const createRecord = (res, err) => {
  responseFormatter(res, err, { message: "Successfully created" });
};

// Encrypt the password
const cryptPassword = (request, res, callback) => {
  if (request.password && request.password === request.password_confirmation) {
    bcrypt.hash(request.password, saltRounds).then((hash) => {
      request.password = hash;
      callback();
    });
  } else {
    responseFormatter(res, { message: "New passwords do not match" }, null);
  }
};

// Compare password text with encrypted password
const comparePassword = (password, user, callback) => {
  bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
    callback(err == null && isPasswordMatch);
  });
};

const formRequest = (data, attributes) => {
  if (!data) return null;

  const output = jbuilder.encode((json) => {
    json.extract(data, ...attributes);
  });

  return JSON.parse(output);
};

const formQuery = (data, attributes) => {
  const output = formRequest(data, attributes);
  if (!output) return null;

  Object.keys(output).forEach((k) => {
    if (k.includes("_id")) {
      output[k] = { _id: output[k] };
    } else {
      output[k] = { $regex: new RegExp(output[k]), $options: "i" };
    }
  });

  return output;
};

const distinctArray = (array, key) => {
  const result = [];
  const map = new Map();
  for (const item of array) {
    if (!map.has(item[key])) {
      map.set(item[key], true);
      result.push(item);
    }
  }
  return result;
};

const updateRelatedTable = (modelToUpdate, arrayToUpdate, keyToUpdate, currentObjectId, updateType) => {
  if (updateType === UPDATE_TYPES.pull) {
    return modelToUpdate.updateMany(
      { _id: arrayToUpdate },
      { $pull: { [keyToUpdate]: currentObjectId } },
      findAndUpdateConfig
    );
  } else {
    return modelToUpdate.updateMany(
      { _id: arrayToUpdate },
      { $addToSet: { [keyToUpdate]: currentObjectId } },
      findAndUpdateConfig
    );
  }
};

const populateDependencyArray = async (req, data, key, idKey, model, JsonFormatter) => {
  const dependencyList = await model.find({ _id: { $in: data.map((x) => x[idKey]) } });
  data.forEach((x) => {
    x[key] = JsonFormatter(
      dependencyList.find((y) => JSON.stringify(y._id) == JSON.stringify(x[idKey])),
      req.headers.locale
    );
  });
  return data;
};

const populateDependencyObject = async (req, data, key, idKey, model, JsonFormatter) => {
  const dependency = await model.findOne({ _id: data[idKey] });
  data[key] = JsonFormatter(dependency, req.headers.locale);
  return data;
};

const genRandomHexCode = (size) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");

function convertArrayToString(arr) {
  let result = '{';
  arr.forEach(el => {
     result = result + `"${el}", `;
  });
  if (arr) {
      result = result.slice(0,-2);
  }
  result = result + '}';
  return result;
}



module.exports = {
  getUrl,
  getAdminUrl,
  isAdmin,
  generateCryptId,
  responseFormatter,
  deleteRecord,
  updateRecord,
  cryptPassword,
  comparePassword,
  formRequest,
  formQuery,
  distinctArray,
  paginateConfig,
  updateRelatedTable,
  createRecord,
  genRandomHexCode,
  populateDependencyArray,
  populateDependencyObject,
  convertArrayToString
};
