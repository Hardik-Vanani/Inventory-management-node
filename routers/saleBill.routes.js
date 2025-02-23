const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    SALE: { APIS, VALIDATOR },
} = require("../controllers");

/* Get Api */
router.get("/:id?", auth, APIS.getSale);

/* Post Apis */
router.post("/", auth, VALIDATOR.create, APIS.create);

/* Put Apis */
router.put("/:id", auth, VALIDATOR.update, APIS.update);

/* Delete Apis */
router.delete("/:id", auth, VALIDATOR.delete, APIS.delete);

module.exports = router;
