const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    VENDOR: { APIS, VALIDATOR },
} = require("../controllers");

/* Get Apis */
router.get("/:id?", auth, APIS.getVendor);

/* Post Apis */
router.post("/", auth, VALIDATOR.createVendor, APIS.createVendor);

/* Put Apis */
router.put("/:id", auth, VALIDATOR.updateVendor, APIS.updateVendor);

/* Delete Apis */
router.delete("/:id", auth, VALIDATOR.deleteVendor, APIS.deleteVendor);

module.exports = router;
