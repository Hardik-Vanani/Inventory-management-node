const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        vendorName: String,
        mobileNo: {
            type: String,
            maxlength: 10,
            required: true,
        },
        user_id: String,
    },
    {
        versionKey: false,
    }
);

module.exports = mongoose.model("vendor", schema, "vendor");
