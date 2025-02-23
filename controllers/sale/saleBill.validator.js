const { validate } = require("express-validation");
const Joi = require("joi");

module.exports = {

    create: validate({
        body: Joi.object({
            billNo: Joi.string().required(),
            customerId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .required(),
            billDate: Joi.date(),
            isGSTBill: Joi.boolean().required(),
            GSTPercentage: Joi.number().precision(2),
            GSTAmount: Joi.number().precision(2),
            totalAmount: Joi.number().precision(2),     // amount
            finalAmount: Joi.number().precision(2),     // amount + GST
            remarks: Joi.string().max(250).allow(""),
            saleBillItems: Joi.array().items(Joi.object({
                productId: Joi.string()
                    .pattern(/^[0-9a-fA-F]{24}$/)
                    .message("Invalid ID")
                    .required(),
                qty: Joi.number(),
                unit: Joi.string(),
                rate: Joi.number(),
                GSTPercentage: Joi.number().precision(2),
                GSTAmount: Joi.number().precision(2),
                totalAmount: Joi.number().precision(2),     // (rate * qty) + GST
            }))

        })
    }),


    update: validate({
        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),

        body: Joi.object({
            billNo: Joi.string().required(),
            billDate: Joi.date(),
            isGSTBill: Joi.boolean().required(),
            GSTPercentage: Joi.number().precision(2),
            GSTAmount: Joi.number().precision(2),
            totalAmount: Joi.number().precision(2),     // amount
            finalAmount: Joi.number().precision(2),     // amount + GST
            remarks: Joi.string().max(250).allow(""),
            saleBillItems: Joi.array().items(Joi.object({
                _id: Joi.string()
                    .pattern(/^[0-9a-fA-F]{24}$/)
                    .message("Invalid ID")
                    .required(),
                productId: Joi.string()
                    .pattern(/^[0-9a-fA-F]{24}$/)
                    .message("Invalid ID")
                    .required(),
                qty: Joi.number(),
                unit: Joi.string(),
                rate: Joi.number(),
                GSTPercentage: Joi.number().precision(2),
                GSTAmount: Joi.number().precision(2),
                totalAmount: Joi.number().precision(2),     // (rate * qty) + GST
            }))

        })
    }),

    delete: validate({
        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
    }),
};
