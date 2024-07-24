const { validate } = require("express-validation");
const Joi = require("joi");

module.exports = {
    createVendor: validate({
        body: Joi.object({
            vendorName: Joi.string().required(),
            mobileNo: Joi.number().max(9999999999).required(),
        }),
    }),

    updateVendor: validate({
        body: Joi.object({
            vendorName: Joi.string(),
            mobileNo: Joi.number().max(9999999999),
        }),

        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
    }),

    deleteVendor: validate({
        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
    }),
};
