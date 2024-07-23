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
        }),
    }),
};
