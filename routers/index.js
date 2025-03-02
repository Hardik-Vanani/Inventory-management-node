const routes = require("express")();

routes.use("/task", require("./taskManager.routes"))
routes.use("/user", require("./user.routes"));
routes.use("/vendor", require("./vendor.routes"));
routes.use("/customer", require("./customer.routes"));
routes.use("/product", require("./product.routes"));
routes.use("/purchase", require("./purchaseBill.routes"));
routes.use("/sale", require("./saleBill.routes"));
routes.use("/reports", require("./report.routes"));
routes.use("/expense", require("./expense.routes"));
routes.use("/income", require("./income.routes"));
routes.use("/chatbot", require("./chatbot.routes"));
routes.use("/csv", require('./csvDown.routes'))
routes.use("/invoice", require('./invoice.routes'))

module.exports = routes;
