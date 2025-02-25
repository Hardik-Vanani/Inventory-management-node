const fs = require('fs');
const path = require('path');
const response = require("../../helpers/response.helper");
const DB = require("../../models");
const messages = require("../../json/message.json");
const puppeteer = require('puppeteer');

module.exports = {
    generateInvoicePDF: async (req, res) => {
        try {
            
        } catch (error) {
            console.log("Error in generating PDF: ", error)
            return response.INTERNAL_SERVER_ERROR([res])
        }
    }
}