const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const response = require("../../helpers/response.helper");
const DB = require("../../models");
const messages = require('../../json/message.json')
const { USER_TYPE: { ADMIN } } = require("../../json/enum.json");
const EMAIL = require("../../services/mail/mail.service");
const { verifyOtp } = require("./user.validator");


module.exports = {

    // Get user details
    getUser: async (req, res) => {
        try {
            let filter = req.user.role === ADMIN
                ? (req.params.id ? { _id: req.params.id, ...req.query } : { ...req.query })
                : { _id: req.user.id };


            const userDetails = await DB.user.find(filter)
            if (!userDetails) return response.NOT_FOUND({ res, message: messages.USER_NOT_FOUND })

            return response.OK({ res, message: messages.USER_FETCHED_SUCCESSFULLY, payload: userDetails })
        } catch (error) {

        }
    },

    // Login existing user
    loginUser: async (req, res) => {
        try {
            // Get username and password from request body
            const { username, password } = req.body;

            const user = await DB.user.findOne({ username });
            if (!user) return response.NOT_FOUND({ res, message: messages.USER_NOT_FOUND });

            // Compare password with hashed password
            const ismatch = await bcryptjs.compare(password, user.password);
            if (!ismatch) return response.UNAUTHORIZED({ res });

            const id = user._id,
                name = user.username,
                role = user.role;

            // Generate JWT token
            const token = jwt.sign({ id, name, role }, process.env.SECRET_KEY, { expiresIn: "50d" });

            return response.OK({ res, message: messages.USER_LOGIN_SUCCESSFULLY, payload: { id, name, token, role } });
        } catch (error) {
            console.error("Error logging user: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    // Create new user
    createUser: async (req, res) => {
        try {
            const { email, username, password, role } = req.body;

            const existingEmail = await DB.user.findOne({ email });
            if (existingEmail) return response.EXISTED({ res, message: messages.EMAIL_ALREADY_EXISTS });

            const existingUser = await DB.user.findOne({ username });
            if (existingUser) return response.EXISTED({ res, message: messages.USER_ALREADY_EXISTS });

            // Password hashed by bcryptjs
            const hashedPassword = await bcryptjs.hash(password, 10);
            const newUser = await DB.user.create({ username, password: hashedPassword, email, role });

            return response.OK({ res, message: messages.USER_CREATED_SUCCESSFULLY, payload: newUser });
        } catch (error) {
            console.error("Error creating user: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    // Update password
    changePassword: async (req, res) => {
        try {
            // Get password from request body
            const { password, newPassword } = req.body;

            // Get user id from authenticated user
            const userId = req.user.id;
            const user = await DB.user.findOne({ _id: userId })
            if (!user) return response.NOT_FOUND({ res, message: messages.USER_NOT_FOUND })

            if (!(await bcryptjs.compare(password, user.password))) return response.UNAUTHORIZED({ res, message: messages.INVALID_PASSWORD });

            const hashedPassword = await bcryptjs.hash(newPassword, 10);
            await DB.user.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true })
            return response.OK({ res, message: messages.PASSWORD_UPDATED_SUCCESSFULLY });
        } catch (error) {
            console.error("Error updating user: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    // Update User Profile
    updateProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            if (!(await DB.user.findOne({ _id: userId }))) return response.NOT_FOUND({ res, message: messages.USER_NOT_FOUND })

            if (req.body.username) {
                const userExistence = await DB.user.findOne({ username: req.body.username, _id: { $ne: userId } });
                if (userExistence) return response.EXISTED({ res, message: messages.USERNAME_ALREADY_EXISTS });
            }

            if (req.file) {
                req.body.profileImage = `/uploads/${req.file.filename}`;
            }

            await DB.user.findByIdAndUpdate(userId, req.body, { new: true })

            return response.OK({ res, message: messages.USER_UPDATED_SUCCESSFULLY })
        } catch (error) {
            return response.INTERNAL_SERVER_ERROR({ res, message: error })
        }
    },

    // Delete user
    deleteUser: async (req, res) => {
        try {
            // Get user id from authenticated user
            const filter = req.user.role === ADMIN ? { _id: req.params.id } : { _id: req.user.id };

            // Find user by id and delete & delete all record of that User
            await DB.user.findOneAndDelete(filter);

            await DB.purchase.deleteMany({ userId: req.user.id })
            await DB.purchaseItem.deleteMany({ userId: req.user.id })
            await DB.sale.deleteMany({ userId: req.user.id })
            await DB.saleItem.deleteMany({ userId: req.user.id })
            await DB.vendor.deleteMany({ userId: req.user.id })
            await DB.customer.deleteMany({ userId: req.user.id })
            await DB.product.deleteMany({ userId: req.user.id })
            await DB.report.deleteMany({ userId: req.user.id })
            await DB.taskManager.deleteMany({ userId: req.user.id })

            return response.OK({ res, message: messages.USER_DELETED_SUCCESSFULLY });
        } catch (error) {
            console.error("Error deleting user: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    // Forgot password
    forgotPassword: async (req, res) => {
        const { email } = req.body;
        try {
            const user = await DB.user.findOne({ email })
            if (!user) return response.NOT_FOUND({ res, message: messages.USER_NOT_FOUND })

            // Generate 4-digit OTP
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const otpExpiry = new Date(Date.now() + 5 * 30 * 1000); // Expires in 5 minutes

            await DB.user.findOneAndUpdate({ email }, { otp: otp, otpExpiry: otpExpiry }, { new: true });

            const sendMail = await EMAIL.sendOTP({ email, name: user.username, otp })
            if (!sendMail) return response.BAD_REQUEST({ res, message: messages.FAILED_SEND_MAIL })

            return response.OK({ res, message: messages.SEND_MAIL_SUCCESSFULLY })

        } catch (error) {
            console.error("Error in sending Otp", error)
            return response.INTERNAL_SERVER_ERROR({ res })
        }
    },


    verifyOtp: async (req, res) => {
        let { email, otp } = req.body
        const user = await DB.user.findOne({ email })
        if (!user) return response.NOT_FOUND({ res, message: messages.USER_NOT_FOUND })

        if (user.otp !== otp) return response.BAD_REQUEST({ res, message: messages.INVALID_OTP })

        // Check if OTP is expired
        if (new Date() > user.otpExpiry) {
            return response.BAD_REQUEST({ res, message: messages.OTP_EXPIRED });
        }
        return response.OK({ res, message: messages.OTP_VERIFIED })
    },


    resetPassword: async (req, res) => {
        let { email, password } = req.body
        const user = await DB.user.findOne({ email })
        if (!user) return response.NOT_FOUND({ res, message: messages.USER_NOT_FOUND })

        const hashedPassword = await bcryptjs.hash(password, 10);
        await DB.user.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true })
        return response.OK({ res, message: messages.PASSWORD_UPDATED_SUCCESSFULLY })
    },
};
