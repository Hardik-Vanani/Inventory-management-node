const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    PURCHASE: { APIS, VALIDATOR },
} = require("../controllers");

/* Get Api*/
router.get("/:id?", auth, APIS.getPurchase);

/* Post Apis */
router.post("/", auth, VALIDATOR.createPurchase, APIS.createPurchase);

/* Put Apis */
router.put("/:id", auth, VALIDATOR.updatePurchase, APIS.updatePurchase);

/* Delete Apis */
router.delete("/:id", auth, VALIDATOR.deletePurchase, APIS.deletePurchase);

module.exports = router;
