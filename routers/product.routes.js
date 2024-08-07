const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    PRODUCT: { APIS, VALIDATOR },
} = require("../controllers");

/* Get Apis */
router.get("/:id?", auth, APIS.getProduct);

/* Post Apis */
router.post("/", auth, VALIDATOR.createProduct, APIS.createProduct);

/* Put Apis */
router.put("/:id", auth, VALIDATOR.updateProduct, APIS.updateProduct);

/* Delete Apis */
router.delete("/:id", auth, VALIDATOR.deleteProduct, APIS.deleteProduct);

module.exports = router;
