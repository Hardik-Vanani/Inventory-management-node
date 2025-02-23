const nodemailer = require("nodemailer")
require("dotenv").config();

// create transporter for mail server
const transporter = nodemailer.createTransport({
    secure: true,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

module.exports = transporter;