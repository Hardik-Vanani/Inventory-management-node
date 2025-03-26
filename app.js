require("dotenv").config();
require("./config/db.conn");
const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');

// const puppeteer = require('puppeteer');
// app.use(bodyParser.json());

// Handle error
const errorHandler = require("./middleware/errorhandler.middleware");

app.use(require('cors')({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Contain all routes
app.use("/api", require("./routers/index"));

// app.use("/uploads", express.static("uploads"));.
app.use("/uploads", express.static("uploads"))


// Handle error which come from the any routes
app.use(errorHandler);

const pdfDir = path.join(__dirname, "generated-pdfs");
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir);
}
app.use("/invoice", express.static(path.join(__dirname, "controllers/invoice/generated-pdfs")));

app.use('/images', express.static(path.join(__dirname, 'images')));


// Listen to the port
app.listen(process.env.PORT, () => {
    console.log(`🚀 SERVER RUNNING ON PORT: ${process.env.PORT} 🚀`);
});
