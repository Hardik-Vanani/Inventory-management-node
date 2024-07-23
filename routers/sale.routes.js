const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    SALE: { APIS, VALIDATOR },
} = require("../controllers");

router.get("/", auth, APIS.getSale);

router.post("/create", auth, VALIDATOR.createSale, APIS.createSale);

router.put("/update/:id", auth, VALIDATOR.updateSale, APIS.updateSale);

router.delete("/delete/:id", auth, VALIDATOR.deleteSale, APIS.deleteSale);

module.exports = router;
