const response = require("../../helpers/response.helper");
const DB = require("../../models");
const messages = require("../../json/message.json");
const { TRASANCTION_TYPE } = require("../../json/enum.json")
const { Parser } = require("json2csv");

module.exports = {
    download: async (req, res) => {
        try {
            let { type, limit } = req.query;
            const userId = req.user.id;
            if (!type) return response.BAD_REQUEST({ res, message: "Bill Type is required to download the Excel file." });

            limit = limit ? parseInt(limit) : 0;
            const data = [];

            if (type === TRASANCTION_TYPE.PURCHASE) {
                const purchaseBills = await DB.purchase.find({ userId }).limit(limit).populate('vendorId', 'vendorName');
                purchaseBills.forEach(({ billNo, billDate, vendorId, isGSTBill, GSTPercentage, GSTAmount, totalAmount, finalAmount, remarks }) => {
                    data.push({
                        "Bill No": billNo,
                        "Bill Date": new Date(billDate).toLocaleDateString("en-GB"),
                        "Vendor Name": vendorId?.vendorName,
                        "Bill Type": isGSTBill ? "With GST" : "Without GST",
                        "GST Percentage": GSTPercentage,
                        "GST Amount": GSTAmount,
                        "Total Amount": totalAmount,
                        "Taxable Amount": finalAmount,
                        "Remarks": remarks
                    });
                });
            } else if (type === TRASANCTION_TYPE.SALE) {
                const salesBills = await DB.sale.find({ userId }).limit(limit).populate('customerId', 'customerName');
                salesBills.forEach(({ billNo, billDate, customerId, isGSTBill, GSTPercentage, GSTAmount, totalAmount, finalAmount, remarks }) => {
                    data.push({
                        "Bill No": billNo,
                        "Bill Date": new Date(billDate).toLocaleDateString("en-GB"),
                        "Customer Name": customerId?.customerName,
                        "Bill Type": isGSTBill ? "With GST" : "Without GST",
                        "GST Percentage": GSTPercentage,
                        "GST Amount": GSTAmount,
                        "Total Amount": totalAmount,
                        "Taxable Amount": finalAmount,
                        "Remarks": remarks
                    });
                });
            } else if (type === TRASANCTION_TYPE.EXPENSE) {
                const expenseBills = await DB.expense.find({ userId }).limit(limit)
                expenseBills.forEach(({ expenseDate, expenseName, supplierName, paymentMode, amount, note }) => {
                    data.push({
                        "Expense Date": new Date(expenseDate).toLocaleDateString("en-GB"),
                        "Expense Name": expenseName,
                        "supplier Name": supplierName,
                        "Payment Mode": paymentMode,
                        "Amount": amount,
                        "Note": note
                    });
                });
            } else if (type === TRASANCTION_TYPE.INCOME) {
                const incomeBills = await DB.income.find({ userId }).limit(limit)
                incomeBills.forEach(({ incomeDate, incomeName, supplierName, paymentMode, amount, note }) => {
                    data.push({
                        "Income Date": new Date(incomeDate).toLocaleDateString("en-GB"),
                        "Income Name": incomeName,
                        "supplier Name": supplierName,
                        "Payment Mode": paymentMode,
                        "Amount": amount,
                        "Note": note
                    });
                });
            } else {
                return response.BAD_REQUEST({ res, message: "Invalid type provided. Choose from purchase, sales, expense, or income." });
            }

            const csvFields = data.length > 0 ? Object.keys(data[0]) : [];
            const parser = new Parser({ fields: csvFields });
            const csvData = parser.parse(data);

            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", `attachment; filename=${type}_Bill.csv`);
            res.status(200).send(csvData);
        } catch (error) {
            console.error("Error in download CSV", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    }
}