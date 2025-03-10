const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    PURCHASE: { APIS, VALIDATOR },
} = require("../controllers");

/* Get Api*/
router.get("/:id?", auth, APIS.getPurchase);

/* Post Apis */
router.post("/", auth, VALIDATOR.create, APIS.createPurchase);

/* Put Apis */
router.put("/:id", auth, VALIDATOR.update, APIS.updatePurchase);

/* Delete Apis */
router.delete("/:id", auth, VALIDATOR.deletePurchase, APIS.deletePurchase);

module.exports = router;
