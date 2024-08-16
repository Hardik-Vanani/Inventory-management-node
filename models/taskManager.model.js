const { string } = require("joi");
const { Schema, model } = require("mongoose");

const taskManagerSchema = new Schema(
    {
        taskName: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            default: "Pending",
        },
        user_id: String,
    },
    {
        versionKey: false,
    }
);

module.exports = model("taskManager", taskManagerSchema, "taskManager");
