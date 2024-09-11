const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    REPORT: { APIS, VALIDATOR },
} = require("../controllers");

/* Get Api */
router.get("/", auth, APIS.getReports);

/* Delete Apis */
router.delete("/:id", auth, VALIDATOR.deleteReport, APIS.deleteReport);

module.exports = router;
