const mongoose = require("mongoose");
require("dotenv").config();

mongoose
    .connect(process.env.MONGO_URL, {
        serverSelectionTimeoutMS: 50000, // 50 seconds timeout
        socketTimeoutMS: 45000, // 45 seconds socket timeout
    })
    .then(() => {
        console.log("✅ MongoDB connected!");
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });
