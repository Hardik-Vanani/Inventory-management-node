const path = require('path');
const response = require("../../helpers/response.helper");
const DB = require("../../models");
const messages = require("../../json/message.json");
const puppeteer = require('puppeteer');
const { invoiceHTML } = require("../../services/invoice/invoice.template")

module.exports = {
    generateInvoicePDF: async (req, res) => {
        const { title, content, items, total } = req.body;


        const fileName = `invoice_${Date.now()}.pdf`;
        const filePath = path.join(pdfDir, fileName);

        const HTMLContent = invoiceHTML({})
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(HTMLContent, { waitUntil: 'load' });
            await page.pdf({ path: filePath, format: 'A4', printBackground: true });
            await browser.close();

            res.status(200).json({
                message: "PDF Generated Successfully",
                viewLink: `http://localhost:5500/invoice/${fileName}`
            });

        } catch (error) {
            console.log("Error in generating PDF: ", error)
            return response.INTERNAL_SERVER_ERROR([res])
        }
    }
}