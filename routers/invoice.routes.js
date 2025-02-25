const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const { INVOICE: { APIS } } = require('../controllers')

router.get("/:id", auth, APIS.generateInvoicePDF)

module.exports = router;