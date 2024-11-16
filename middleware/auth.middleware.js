const response = require("../helpers/response.helper");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        // Get token from the header
        const token = req.headers.token;

        // Verify token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return response.TOKEN_EXPIRED({ res, err });
                } else {
                    return response.TOKEN_NEEDED({ res, err });
                }
            }
            
            req.user = decoded;
            req.token = token;
            // Go to on next task
            next();
        });
    } catch (error) {
        return response.INTERNAL_SERVER_ERROR({ res });
    }
};

module.exports = auth;
