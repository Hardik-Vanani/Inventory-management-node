const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const { CSV: { APIS } } = require('../controllers')

router.get("/", auth, APIS.download)

module.exports = router;