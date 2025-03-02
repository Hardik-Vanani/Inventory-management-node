const Product = require("../models/product.model");
const SaleItem = require("../models/sale-item.model");
const SaleBill = require("../models/saleBill.model");
const Vendor = require("../models/vendor.model");
const Customer = require("../models/customer.model");

const getChatbotResponse = async (req, res) => {
    try {
        const { query } = req.body;
        const lowerCaseQuery = query.toLowerCase();

        // ✅ Basic Greetings
        if (["hi", "hello", "hey", "hii"].includes(lowerCaseQuery)) {
            return res.json({ response: "Hello! How can I assist you today? 😊" });
        }

        if (lowerCaseQuery.includes("how are you")) {
            return res.json({ response: "I'm just a bot, but I'm always here to help! How can I assist you?" });
        }

        if (lowerCaseQuery.includes("who are you")) {
            return res.json({ response: "I'm your Smart Assistant, here to provide insights into your inventory and sales. 🚀" });
        }

        if (lowerCaseQuery.includes("thank you") || lowerCaseQuery.includes("thanks")) {
            return res.json({ response: "You're welcome! Let me know if you need anything else. 😊" });
        }

        if (lowerCaseQuery.includes("what can you do")) {
            return res.json({ response: "I can answer queries about sales, stock, vendors, and customers. Try asking: 'How many sales today?' or 'Which product has the lowest stock?'" });
        }

        // ✅ Sales Query (Using SaleBill Model)
        if (lowerCaseQuery.includes("sales today")) {
            const today = new Date().toISOString().split("T")[0];
            const sales = await SaleBill.aggregate([
                { $match: { billDate: new Date(today) } },
                { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }
            ]);
            return res.json({ response: `Today's total sales are ₹${sales[0]?.totalSales || 0}.` });
        }

        // ✅ Stock Query (Using Product Model)
        if (lowerCaseQuery.includes("lowest stock")) {
            const lowestStockProduct = await Product.findOne().sort({ stock: 1 }).select("productName stock");
            return res.json({
                response: lowestStockProduct
                    ? `The lowest stock product is '${lowestStockProduct.productName}' with ${lowestStockProduct.stock} units left.`
                    : "No products found."
            });
        }

        // ✅ Total Products Query
        if (lowerCaseQuery.includes("total products")) {
            const productCount = await Product.countDocuments();
            return res.json({ response: `You have ${productCount} products in stock.` });
        }

        // ✅ Vendors Count
        if (lowerCaseQuery.includes("total vendors")) {
            const vendorCount = await Vendor.countDocuments();
            return res.json({ response: `You have ${vendorCount} registered vendors.` });
        }

        // ✅ Total Customers
        if (lowerCaseQuery.includes("total customers")) {
            const customerCount = await Customer.countDocuments();
            return res.json({ response: `There are ${customerCount} active customers.` });
        }

        // ✅ Highest Sold Product (Using SaleItem Model)
        if (lowerCaseQuery.includes("highest sold product")) {
            const highestSoldProduct = await SaleItem.aggregate([
                { $group: { _id: "$productId", totalSold: { $sum: "$qty" } } },
                { $sort: { totalSold: -1 } },
                { $limit: 1 }
            ]);
            return res.json({
                response: highestSoldProduct.length
                    ? `The highest sold product ID is '${highestSoldProduct[0]._id}' with ${highestSoldProduct[0].totalSold} units.`
                    : "No sales data available."
            });
        }

        return res.json({ response: "I didn't understand. Try asking about sales, stock, or vendors." });
    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Failed to get response" });
    }
};

module.exports = { getChatbotResponse };
