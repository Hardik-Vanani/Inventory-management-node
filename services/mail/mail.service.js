const template = require("./mail.template")
require("dotenv").config()

const transporter = require("../../config/mail.config")

module.exports = {
    sendOTP: async ({ email, name, otp }) => {
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: `${email}`,
            subject: "Stock Tracker",
            text: 'One Time Password To Verify Your Account',
            html: template.sendOTP({ otp, name })
        }

        await transporter.sendMail(mailOptions)
        return { success: true }
    }
}