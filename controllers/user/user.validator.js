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
            role: Joi.string(),
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

    changePassword: validate({
        body: Joi.object({
            password: Joi.string().required(),
            newPassword: Joi.string().required(),
        }),
    }),

    updateProfile: validate({
        body: Joi.object({
            email: Joi.string(),
            username: Joi.string(),
            firstName: Joi.string(),
            lastName: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            shopName: Joi.string()
        })
    }),

    forgotPassword: validate({
        body: Joi.object({
            email: Joi.string()
                .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .required()
                .messages({
                    "string.pattern.base": "Please enter a valid email address",
                    "string.empty": "Email field cannot be empty",
                    "any.required": "Email is required",
                }),

        })
    })
};
