const path = require('path');
const fs = require('fs');
const response = require("../../helpers/response.helper");
const DB = require("../../models");
const messages = require("../../json/message.json");
const puppeteer = require('puppeteer');
const { invoiceHTML } = require("../../services/invoice/invoice.template")

module.exports = {
    generateInvoicePDF: async (req, res) => {
        const id = req.params.id
        const saleBills = await DB.sale.find({ _id: id })
            .populate("userId", "-password -otp -otpExpiry -role -createdAt -updatedAt")
            .populate("customerId", "-createdAt -updatedAt -userId")
            .lean();

        const saleBillIds = saleBills.map(bill => bill._id);

        const saleItems = await DB.saleItem.find({
            saleBillId: { $in: saleBillIds }
        })
            .populate("productId", "-createdAt -updatedAt -userId")
            .lean()
            .select("-createdAt -updatedAt -userId");

        // Group sale items by saleBillId
        const saleItemsMap = saleItems.reduce((acc, item) => {
            const billId = item.saleBillId.toString();
            if (!acc[billId]) acc[billId] = [];
            acc[billId].push(item);
            return acc;
        }, {});

        // Attach sale items to their respective sale bills
        const result = saleBills.map(bill => ({
            ...bill,
            saleItems: saleItemsMap[bill._id.toString()] || []
        }));

        const pdfDir = path.join(__dirname, "generated-pdfs");
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir);
        }
        const bill = result[0]
        const fileName = `invoice_${Date.now()}.pdf`;
        const filePath = path.join(pdfDir, fileName);

        const HTMLContent = invoiceHTML({ bill })
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