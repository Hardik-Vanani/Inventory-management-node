const response = require("../helpers/response.helper");

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.headers.token;

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    const customeError = { name: err.name, message: err.message, expiredAt: err.expiredAt };
                    req.error = customeError;
                } else {
                    const customeError = { name: err.name, message: err.message };
                    req.error = customeError;
                }
            }
            req.user = decoded;
            req.token = token;

            next();
        });
    } catch (error) {
        return response.INTERNAL_SERVER_ERROR({ res });
    }
};

const validateObjectId = (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return response.BAD_REQUEST({ res });
        }
        next();
    } catch (error) {
        return response.INTERNAL_SERVER_ERROR({ res });
    }
};

module.exports = { auth, validateObjectId };
