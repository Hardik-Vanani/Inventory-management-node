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
        userId: { type: Schema.Types.ObjectId, ref: "user" },
    },
    {
        versionKey: false,
    }
);

module.exports = model("taskManager", taskManagerSchema, "taskManager");
