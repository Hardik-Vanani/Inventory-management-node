const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    SUMMARY: { APIS, VALIDATOR },
} = require("../controllers");

router.get("/", auth, APIS.getSummary);

router.delete("/delete/:id", auth, VALIDATOR.deleteSummary, APIS.deleteSummary);

module.exports = router;
