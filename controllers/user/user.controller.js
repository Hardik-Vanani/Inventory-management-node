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
            const { username, password } = req.body;

            const existingUser = await DB.user.findOne({ username });
            if (existingUser) return response.EXISTED({ res });

            // Password hashed by bcryptjs 
            const hashedPassword = await bcryptjs.hash(password, 10);
            const newUser = await DB.user.create({ username, password: hashedPassword });

            return response.OK({ res, payload: { newUser } });
        } catch (error) {
            console.error("Error creating user: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
