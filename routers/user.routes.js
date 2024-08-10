const express = require("express");
const router = express.Router();

const {
    USER: { APIS, VALIDATOR },
} = require("../controllers");

/* Login user Api */
router.post("/signin", VALIDATOR.loginUser, APIS.loginUser);

/* Create new credential Api */
router.post("/signup", VALIDATOR.createUser, APIS.createUser);

module.exports = router;
