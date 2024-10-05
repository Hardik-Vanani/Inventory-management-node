const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const response = require("../../helpers/response.helper");
const DB = require("../../models");

module.exports = {
    // Login existing user
    loginUser: async (req, res) => {
        try {
            // Get username and password from request body
            const { username, password } = req.body;

            const user = await DB.user.findOne({ username });
            if (!user) return response.NOT_FOUND({ res });

            // Compare password with hashed password
            const ismatch = await bcryptjs.compare(password, user.password);
            if (!ismatch) return response.UNAUTHORIZED({ res });

            const id = user._id,
                name = user.username;

            // Generate JWT token
            const token = jwt.sign({ id, name }, process.env.SECRET_KEY, { expiresIn: "5d" });

            return response.OK({ res, payload: { id, name, token } });
        } catch (error) {
            console.error("Error logging user: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    // Create new user
    createUser: async (req, res) => {
        try {
            const { email, username, password } = req.body;

            const existingEmail = await DB.user.findOne({ email });
            if (existingEmail) return response.EXISTED({ res });

            const existingUser = await DB.user.findOne({ username });
            if (existingUser) return response.EXISTED({ res });

            // Password hashed by bcryptjs
            const hashedPassword = await bcryptjs.hash(password, 10);
            const newUser = await DB.user.create({ username, password: hashedPassword, email });

            return response.OK({ res, payload: { newUser } });
        } catch (error) {
            console.error("Error creating user: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
    
            // Validate the ObjectId
        
            const { password } = req.body;
    
            if (!password) {
                return res.status(400).json({ success: false, message: "Password is required." });
            }
    
            const hashedPassword = await bcryptjs.hash(password, 10);
            const updatedUser = await DB.user.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
    
            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "User not found." });
            }
    
            return res.status(200).json({ success: true, payload: { updatedUser } });
        } catch (error) {
            console.error("Error updating user: ", error);
            return res.status(500).json({ success: false, message: "Internal Server Error." });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedUser = await DB.user.findByIdAndDelete(id);

            return response.OK({ res, payload: { deletedUser } });
        } catch (error) {
            console.error("Error deleting user: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
