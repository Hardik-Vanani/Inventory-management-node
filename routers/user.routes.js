const express = require("express");
const router = express.Router();

const {
    USER: { APIS, VALIDATOR },
} = require("../controllers");

/* Login user Api */
router.post("/signin", VALIDATOR.loginUser, APIS.loginUser);

/* Create new credential Api */
router.post("/signup", VALIDATOR.createUser, APIS.createUser);

/* Update your password */
router.put("/:id", VALIDATOR.updateUser, APIS.updateUser);

/* Delete your account */
router.delete("/:id", VALIDATOR.deleteUser, APIS.deleteUser);

/* forgot password */
// router.post("/forgot", VALIDATOR.forgotPassword, APIS.forgotPassword);

module.exports = router;
