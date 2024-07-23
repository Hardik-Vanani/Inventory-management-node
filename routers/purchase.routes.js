const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    PURCHASE: { APIS, VALIDATOR },
} = require("../controllers");

router.get("/", auth, APIS.getPurchase);

router.post("/", auth, VALIDATOR.createPurchase, APIS.createPurchase);

router.put("/:id", auth, VALIDATOR.updatePurchase, APIS.updatePurchase);

router.delete("/:id", auth, VALIDATOR.deletePurchase, APIS.deletePurchase);

module.exports = router;
