const njwt = require("njwt");
const User = require("Models/user");
const { TOKEN_SECRET } = require("Utilities/constants");
const { comparePassword } = require("Utilities/helpers");

const encodeToken = (tokenData) => {
	const token = njwt.create(tokenData, TOKEN_SECRET);
	const today = new Date();
	// Set token to expire one month from time of login
	token.setExpiration(today.setMonth(today.getMonth() + 1));
	return token.compact();
};

const decodeToken = (token) => {
	return njwt.verify(token, TOKEN_SECRET).body;
};

// This express middleware attaches `userEmail` and `userPassword` to the `req` object if a user is
// authenticated. This middleware expects a JWT token to be stored in the
// `Access-Token` header.
const jwtAuthenticationMiddleware = async (req, res, next) => {
	const token = req.header("Access-Token");
	if (!token) {
		return next();
	}

	try {
		const decoded = decodeToken(token);
		const { userEmail, userPassword } = decoded;

		console.log("decoded", decoded);

		const user = await User.findOne({ email: userEmail });
		if (user) {
			// If password has changed after last token was generated,
			// token is invalid
			comparePassword(userPassword, user, (isPasswordMatch) => {
				if (isPasswordMatch) {
					console.log("found user!");
					req.userEmail = user.email;
					req.userId = user._id;
				}
				next();
			});
		} else {
			next();
		}
	} catch (e) {
		return next();
	}
};

const throwNotAuthenticatedError = (res) => {
	res.status(401);
	res.json({ error: { message: "User not authenticated" } });
};

// This middleware stops the request if a user is not authenticated.
const isAuthenticatedMiddleware = async (req, res, next) => {
	if (req.userEmail) {
		return next();
	}
	throwNotAuthenticatedError(res);
};

module.exports = {
	encodeToken,
	jwtAuthenticationMiddleware,
	isAuthenticatedMiddleware,
	throwNotAuthenticatedError,
};
