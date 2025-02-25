const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware")

const { USER: { APIS, VALIDATOR } } = require("../controllers");

/* Get APIs*/
router.get("/:id?", auth, APIS.getUser)


/* Post APIs */
router.post("/signin", VALIDATOR.loginUser, APIS.loginUser);

router.post("/signup", VALIDATOR.createUser, APIS.createUser);

router.post("/forgot-password", VALIDATOR.forgotPassword, APIS.forgotPassword);

router.post("/verify-otp", VALIDATOR.verifyOtp, APIS.verifyOtp);


/* Put APIs */
router.put("/change-password", auth, VALIDATOR.changePassword, APIS.changePassword);

router.put("/update-profile", auth, upload.single("profileImage"), VALIDATOR.updateProfile, APIS.updateProfile);

router.put("/reset-password", VALIDATOR.resetPassword, APIS.resetPassword);



/* Delete APIs */
router.delete("/", auth, APIS.deleteUser);


module.exports = router;
