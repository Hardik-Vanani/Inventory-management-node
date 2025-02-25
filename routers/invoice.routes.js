const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const { INVOICE: { APIS } } = require('../controllers')

router.post("/", auth, APIS.generateInvoicePDF)

module.exports = router;