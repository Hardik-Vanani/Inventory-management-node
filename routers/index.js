const routes = require("express")();

routes.use("/user", require("./user.routes"));
routes.use("/vendor", require("./vendor.routes"));
routes.use("/customer", require("./customer.routes"));
routes.use("/product", require("./product.routes"));
routes.use("/purchase", require("./purchase.routes"));
routes.use("/sale", require("./sale.routes"));
routes.use("/reports", require("./summary.routes"));

module.exports = routes;
