const express = require("express");
const { getChatbotResponse } = require("../controllers/chatbot.controller");

const router = express.Router();

router.post("/query", getChatbotResponse);

module.exports = router;
