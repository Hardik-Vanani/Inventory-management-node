const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    CUSTOMER: { APIS, VALIDATOR },
} = require("../controllers");

router.get("/", auth, APIS.getCustomer);

router.post("/create", auth, VALIDATOR.createCustomer, APIS.createCustomer);

router.put("/:id", auth, VALIDATOR.updateCustomer, APIS.updateCustomer);

router.delete("/:id", auth, VALIDATOR.deleteCustomer, APIS.deleteCustomer);

module.exports = router;
