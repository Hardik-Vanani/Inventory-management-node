const { validate } = require("express-validation");
const Joi = require("joi");

// Validator for routes
module.exports = {
    deleteReport: validate({
        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
    }),
};
