const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    PRODUCT: { APIS, VALIDATOR },
} = require("../controllers");

router.get("/:id?", auth, APIS.getProduct);

router.post("/", auth, VALIDATOR.createProduct, APIS.createProduct);

router.put("/:id", auth, VALIDATOR.updateProduct, APIS.updateProduct);

router.delete("/:id", auth, VALIDATOR.deleteProduct, APIS.deleteProduct);

module.exports = router;
