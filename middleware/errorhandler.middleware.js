const { ValidationError } = require("express-validation");

const errorHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        if (err.details.body) {
            const errorDetails = err.details.body.map((detail) => ({
                field: detail.context.key,
                message: detail.message.replace(/\\/g, "").replace(/\"/g, ""),
            }));

            return res.status(err.statusCode).json({
                status: "false",
                errors: errorDetails[0],
            });
        }

        if (err instanceof ValidationError) {
            const errorDetails = err.details.params.map((detail) => ({
                field: detail.context.key,
                message: detail.message,
            }));

            return res.status(err.statusCode).json({
                status: "false",
                errors: errorDetails[0],
            });
        }
    }

    return next(err);
};

module.exports = errorHandler;
