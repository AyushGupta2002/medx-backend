const jbuilder = require("jbuilder");

const UserJson = (data) => {
	if (!data) return null;
	console.log(data);

	const output = jbuilder.encode((json) => {
		json.extract(data, "id", "accessToken", "firstName", "lastName", "email", "mobile");
	});
	return JSON.parse(output);
};

module.exports = UserJson;
