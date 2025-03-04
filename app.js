require("dotenv").config();
require("./config/db.conn");
const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');

// const puppeteer = require('puppeteer');
// app.use(bodyParser.json());

// Handle error
const errorHandler = require("./middleware/errorhandler.middleware");

app.use(require('cors')({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Contain all routes
app.use("/api", require("./routers/index"));

// app.use("/uploads", express.static("uploads"));.
app.use("/uploads", express.static("uploads"))


// Handle error which come from the any routes
app.use(errorHandler);

const pdfDir = path.join(__dirname, "generated-pdfs");
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir);
}
app.use("/invoice", express.static(path.join(__dirname, "generated-pdfs")));

// app.post('/generate-pdf', async (req, res) => {
//     const { title, content, items, total } = req.body;

//     if (!title || !content || !items || !total) {
//         return res.status(400).json({ error: "Missing required fields" });
//     }

//     const fileName = `invoice_${Date.now()}.pdf`;
//     const filePath = path.join(pdfDir, fileName);

//     const htmlContent = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Invoice</title>
//         <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             .invoice-container { width: 210mm; height: 297mm; padding: 20mm; border: 1px solid #ddd; background: #fff; }
//             .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
//             .invoice-title { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; }
//             .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//             .items-table th { background-color: #f4f4f4; }
//             .total-section { text-align: right; margin-top: 20px; }
//         </style>
//     </head>
//     <body>
//         <div class="invoice-container">
//             <div class="header">
//                 <h2>Company Name</h2>
//                 <div>
//                     <h3>Invoice</h3>
//                     <p><strong>Date:</strong> ${new Date().toISOString().split('T')[0]}</p>
//                     <p><strong>Invoice #:</strong> INV-${Date.now()}</p>
//                 </div>
//             </div>
//             <p><strong>Billed To:</strong> ${content}</p>
//             <table class="items-table">
//                 <thead>
//                     <tr><th>Description</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>
//                 </thead>
//                 <tbody>
//                     ${items.map(item => `<tr><td>${item.description}</td><td>${item.quantity}</td><td>$${item.price}</td><td>$${item.quantity * item.price}</td></tr>`).join('')}
//                 </tbody>
//             </table>
//             <div class="total-section">
//                 <p><strong>Total:</strong> $${total}</p>
//             </div>
//         </div>
//     </body>
//     </html>`;

//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         await page.setContent(htmlContent, { waitUntil: 'load' });
//         await page.pdf({ path: filePath, format: 'A4', printBackground: true });
//         await browser.close();

//         res.status(200).json({
//             message: "PDF Generated Successfully",
//             viewLink: `http://localhost:5500/generated-pdfs/${fileName}`
//         });

//     } catch (error) {
//         console.error("PDF Generation Error:", error);
//         res.status(500).json({ error: "Failed to Generate PDF" });
//     }
// });

// Listen to the port


app.listen(process.env.PORT, () => {
    console.log(`🚀 SERVER RUNNING ON PORT: ${process.env.PORT} 🚀`);
});
