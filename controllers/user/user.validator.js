const { validate } = require("express-validation");
const Joi = require("joi");

module.exports = {
    loginUser: validate({
        body: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
        }),
    }),

    createUser: validate({
        body: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
            email: Joi.string()
                .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .required()
                .messages({
                    "string.pattern.base": "Please enter a valid email address",
                    "string.empty": "Email field cannot be empty",
                    "any.required": "Email is required",
                }),
        }),
    }),

    updateUser: validate({
        body: Joi.object({
            password: Joi.string().required(),
        }),
    }),
};
