const { validate } = require("express-validation");
const Joi = require("joi");

module.exports = {
    createTasks: validate({
        body: Joi.object({
            taskName: Joi.string().required(),
            status: Joi.string().required(),
            date: Joi.string().required(),
        }),
    }),

    updateTask: validate({
        body: Joi.object({
            taskName: Joi.string().required(),
            status: Joi.string().required(),
            date: Joi.string().optional(),
        }),

        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
    }),

    deleteTask: validate({
        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
    }),
};
