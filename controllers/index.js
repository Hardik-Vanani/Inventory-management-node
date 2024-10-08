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
        APIS: require("./purchase/purchase.controller"),
        VALIDATOR: require("./purchase/purchase.validator"),
    },

    SALE: {
        APIS: require("./sale/sale.controller"),
        VALIDATOR: require("./sale/sale.validator"),
    },

    REPORT: {
        APIS: require("./report/report.controller"),
        VALIDATOR: require("./report/report.validator"),
    },

    TASKMANAGER: {
        APIS: require("./taskManager/taskManager.controller"),
        VALIDATOR: require("./taskManager/taskManager.validator"),
    },
};
