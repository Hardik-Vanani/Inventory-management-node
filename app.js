require("dotenv").config();
require("./db/conn");
const express = require("express");
const app = express();
const cors = require("cors");

const errorHandler = require("./middleware/errorhandler.middleware");

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Contain all routes
app.use("/api", require("./routers/index"));

// Handle error which come from the any routes
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`PORT : ${process.env.PORT} 🖥️  🚀`);
});
