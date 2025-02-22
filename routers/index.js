const routes = require("express")();

routes.use("/task", require("./taskManager.routes"))
routes.use("/user", require("./user.routes"));
routes.use("/vendor", require("./vendor.routes"));
routes.use("/customer", require("./customer.routes"));
routes.use("/product", require("./product.routes"));
routes.use("/purchase", require("./purchaseBill.routes"));
routes.use("/sale", require("./saleBill.routes"));
routes.use("/reports", require("./report.routes"));

module.exports = routes;
