const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    SALE: { APIS, VALIDATOR },
} = require("../controllers");

/* Get Api */
router.get("/:id?", auth, APIS.getSale);

/* Post Apis */
router.post("/", auth, VALIDATOR.createSale, APIS.createSale);

/* Put Apis */
router.put("/:id", auth, VALIDATOR.updateSale, APIS.updateSale);

/* Delete Apis */
router.delete("/:id", auth, VALIDATOR.deleteSale, APIS.deleteSale);

module.exports = router;
