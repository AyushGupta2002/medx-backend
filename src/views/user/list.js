const jbuilder = require("jbuilder");

var UserListJson = (data) => {
  if (!data) return null;

  const output = jbuilder.encode((json) => {
    json.extract(data, (json, user) => {
      json.extract(user, "id", "firstName", "lastName", "email", "mobile");
    });
  });
  return JSON.parse(output);
};

module.exports = UserListJson;
