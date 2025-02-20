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


/* Put APIs */
router.put("/changePassword", auth, VALIDATOR.changePassword, APIS.changePassword);

router.put("/updateProfile", auth, upload.single("profileImage"), VALIDATOR.updateProfile, APIS.updateProfile);

// router.put("/forgot", VALIDATOR.forgotPassword, APIS.forgotPassword);


/* Delete APIs */
router.delete("/", auth, APIS.deleteUser);


module.exports = router;
