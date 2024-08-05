const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    CUSTOMER: { APIS, VALIDATOR },
} = require("../controllers");

/* Get Apis */
router.get("/:id?", auth, APIS.getCustomer);

/* Post Apis */
router.post("/", auth, VALIDATOR.createCustomer, APIS.createCustomer);

/* Put Apis */
router.put("/:id", auth, VALIDATOR.updateCustomer, APIS.updateCustomer);

/* Delete Apis */
router.delete("/:id", auth, VALIDATOR.deleteCustomer, APIS.deleteCustomer);

module.exports = router;
