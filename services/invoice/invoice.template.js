const moment = require('moment');

module.exports = {
    invoiceHTML: ({ bill }) => {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Invoice</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        margin: 0;
                        padding: 40px;
                        color: #333;
                        background-color: #f9fafb;
                    }
                    .invoice-container {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 40px;
                        border: 1px solid #e0e0e0;
                        border-radius: 12px;
                        background-color: #fff;
                        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
                    }
                    .header-section {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 40px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #e0e0e0;
                    }
                    .logo {
                        width: 150px;
                        height: auto;
                    }
                    .header {
                        text-align: right;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 32px;
                        color: #2c3e50;
                        font-weight: 700;
                        letter-spacing: -1px;
                    }
                    .header p {
                        margin: 8px 0;
                        font-size: 14px;
                        color: #777;
                    }
                    .details {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 40px;
                    }
                    .details .left, .details .right {
                        width: 48%;
                    }
                    .details h2 {
                        font-size: 18px;
                        margin-bottom: 12px;
                        color: #2c3e50;
                        font-weight: 600;
                        border-bottom: 2px solid #e0e0e0;
                        padding-bottom: 8px;
                    }
                    .details p {
                        margin: 6px 0;
                        font-size: 14px;
                        color: #555;
                    }
                    .table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 40px;
                    }
                    .table th, .table td {
                        border: 1px solid #e0e0e0;
                        padding: 14px;
                        text-align: left;
                    }
                    .table th {
                        background-color: #f8f9fa;
                        font-weight: 600;
                        color: #2c3e50;
                        font-size: 14px;
                    }
                    .table td {
                        background-color: #fff;
                        font-size: 14px;
                        color: #555;
                    }
                    .table tr:nth-child(even) td {
                        background-color: #f8f9fa;
                    }
                    .total-remarks-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-top: 30px;
                        padding-top: 30px;
                        border-top: 2px solid #e0e0e0;
                    }
                    .total {
                        text-align: right;
                        font-size: 16px;
                        font-weight: 600;
                    }
                    .total p {
                        margin: 8px 0;
                        color: #555;
                    }
                    .footer {
                        text-align: left;
                        font-size: 14px;
                        color: #777;
                    }
                    .footer p {
                        margin: 6px 0;
                    }
                    .highlight {
                        color: #2c3e50;
                        font-weight: 700;
                    }
                    .signature-section {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 2px solid #e0e0e0;
                        text-align: right;
                    }
                    .signature-section p {
                        margin: 0;
                        font-size: 14px;
                        color: #555;
                    }
                    .thank-you {
                        text-align: center;
                        margin-top: 40px;
                        font-size: 16px;
                        color: #2c3e50;
                        font-weight: 600;
                    }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <!-- Header Section with Logo -->
                    <div class="header-section">
                        <!-- Company Logo on the Left -->
                        <div class="logo">
                            <img src="http://localhost:5500/images/stock.jpg" alt="Company Logo" class="logo">
                        </div>

                        <!-- Header Details on the Right -->
                        <div class="header">
                            <h1>INVOICE</h1>
                            <p>Invoice Number: <span class="highlight">${bill.billNo}</span></p>
                            <p>Date: <span class="highlight">${moment(bill.billDate).format("DD/MM/YYYY")}</span></p>
                        </div>
                    </div>

                    <!-- Bill From & Bill To Section -->
                    <div class="details">
                        <div class="left">
                            <h2>Bill From:</h2>
                            <p>${bill.userId.username}</p>
                            <p>Email: ${bill.userId.email}</p>
                        </div>
                        <div class="right">
                            <h2>Bill To:</h2>
                            <p>${bill.customerId?.customerName || 'Unavailable customer'}</p>
                            <p>Mobile: ${bill.customerId.mobileNo}</p>
                            <p>City: ${bill.customerId.city}</p>
                            <p>State: ${bill.customerId.state}</p>
                        </div>
                    </div>

                    <!-- Product Details Table -->
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>HSN Code</th>
                                <th>Unit</th>
                                <th>Rate</th>
                                ${bill.isGSTBill ? "<th>GST (%)</th>" : ""}
                                ${bill.isGSTBill ? "<th>GST Amount</th>" : ""}
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bill.saleItems.map((item) => `
                                <tr>
                                    <td>${item.productId?.productName || 'Unavailable product'}</td>
                                    <td>${item.qty}</td>
                                    <td>${item.productId?.hsnCode || 'Unavailable product'}</td>
                                    <td>${item.unit}</td>
                                    <td>₹${item.rate}</td>
                                    ${bill.isGSTBill ? `<td>${item.GSTPercentage}%</td>` : ""}
                                    ${bill.isGSTBill ? `<td>₹${item.GSTAmount}</td>` : ""}
                                    <td>₹${item.totalAmount}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>

                    <!-- Total & Remarks Section -->
                    <div class="total-remarks-container">
                        <div class="footer">
                            <p>Remarks: ${bill.remarks}</p>
                        </div>
                        <div class="total">
                            <p>Total Amount: <span class="highlight">₹${bill.totalAmount}</span></p>
                            ${bill.isGSTBill ? `
                                <p>GST(%): <span class="highlight">${bill.GSTPercentage}%</span></p>
                                <p>GST Amount: <span class="highlight">₹${bill.GSTAmount}</span></p>
                            ` : ""}
                            <p>Final Amount: <span class="highlight">₹${bill.finalAmount}</span></p>
                        </div>
                    </div>

                    <!-- Signature Section -->
                    <div class="signature-section">
                        <p>Authorized Signature</p>
                        <p>________________________</p>
                    </div>

                    <!-- Thank You Section -->
                    <div class="thank-you">
                        <p>Thank you for your business!</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
}