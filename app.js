require("dotenv").config();
require("./db/conn");
const express = require("express");
const app = express();
const cors = require("cors");

const login_route = require("./routers/login.routes");
const vendor_route = require("./routers/vendor.routes");
const customer_schema = require("./routers/customer.routes");
const product_schema = require("./routers/product.routes");
const purchase_schema = require("./routers/purchase.routes");
const sale_schema = require("./routers/sale.routes");
const summary = require("./routers/summary.routes");

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/login", login_route);
app.use("/vendor", vendor_route);
app.use("/customer", customer_schema);
app.use("/product", product_schema);
app.use("/purchase", purchase_schema);
app.use("/sale", sale_schema);
app.use("/summary", summary);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}...`);
});
