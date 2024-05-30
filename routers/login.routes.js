const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { HTTP_CODE, MESSAGE } = require("../json/message.json");
const response = require("../helpers/response.helper");

const login = require("../schemas/login.schema");

router.get("/", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return response.ALL_REQUIRED({ res });

        const user = await login.findOne({ username });
        if (!user) return response.NOT_FOUND({ res });

        const ismatch = await bcryptjs.compare(password, user.password);
        if (!ismatch) return response.UNAUTHORIZED({ res });

        const id = user._id,
            name = user.username;
        const token = jwt.sign({ id, name }, process.env.SECRET_KEY, { expiresIn: "5d" });

        return response.OK({ res, payload: { id, name, token } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});

router.post("/create", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) response.ALL_REQUIRED({ res });

        const existingUser = await login.findOne({ username });
        if (existingUser) return response.EXISTED({ res });

        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = await login.create({ username, password: hashedPassword });

        return response.OK({ res, payload: { newUser } });
    } catch (error) {
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});

module.exports = router;
