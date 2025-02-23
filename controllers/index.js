module.exports = {
    //Apis and validations
    USER: {
        APIS: require("./user/user.controller"),
        VALIDATOR: require("./user/user.validator"),
    },

    PRODUCT: {
        APIS: require("./product/product.controller"),
        VALIDATOR: require("./product/product.validator"),
    },

    VENDOR: {
        APIS: require("./vendor/vendor.controller"),
        VALIDATOR: require("./vendor/vendor.validator"),
    },

    CUSTOMER: {
        APIS: require("./customer/customer.controller"),
        VALIDATOR: require("./customer/customer.validator"),
    },

    PURCHASE: {
        APIS: require("./purchase/purchaseBill.controller"),
        VALIDATOR: require("./purchase/purchaseBill.validator"),
    },

    SALE: {
        APIS: require("./sale/saleBill.controller"),
        VALIDATOR: require("./sale/saleBill.validator"),
    },

    REPORT: {
        APIS: require("./report/report.controller"),
        VALIDATOR: require("./report/report.validator"),
    },

    TASKMANAGER: {
        APIS: require("./taskManager/taskManager.controller"),
        VALIDATOR: require("./taskManager/taskManager.validator"),
    },

    EXPENSE: {
        APIS: require("./expense/expense.controller"),
        VALIDATOR: require("./expense/expense.validator")
    },

    INCOME: {
        APIS: require("./income/income.controller"),
        VALIDATOR: require("./income/income.validator")
    }
};
