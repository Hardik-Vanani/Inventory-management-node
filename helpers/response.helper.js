const { HTTP_CODE, MESSAGE } = require("../json/message.json");

const response = {
    OK({ res, count, payload = {} }) {
        res.status(HTTP_CODE.OK).json({
            success: true,
            message: MESSAGE.OK,
            count,
            payload,
        });
    },

    CREATED({ res, payload = {} }) {
        res.status(HTTP_CODE.CREATED).json({
            success: true,
            message: MESSAGE.CREATED,
            payload,
        });
    },
    ALL_REQUIRED({ res, payload = {} }) {
        res.status(HTTP_CODE.ALL_REQUIRED).json({
            success: false,
            message: MESSAGE.ALL_REQUIRED,
            payload,
        });
    },

    NOT_FOUND({ res }) {
        res.status(HTTP_CODE.NOT_FOUND).json({
            success: false,
            message: MESSAGE.NOT_FOUND,
        });
    },

    UNAUTHORIZED({ res }) {
        res.status(HTTP_CODE.UNAUTHORIZED).json({
            success: false,
            message: MESSAGE.UNAUTHORIZED,
        });
    },

    EXISTED({ res }) {
        res.status(HTTP_CODE.EXISTED).json({
            success: false,
            message: MESSAGE.EXISTED,
        });
    },

    BAD_REQUEST({ res }) {
        res.status(HTTP_CODE.BAD_REQUEST).json({
            success: false,
            message: MESSAGE.BAD_REQUEST,
        });
    },

    INTERNAL_SERVER_ERROR({ res }) {
        res.status(HTTP_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGE.INTERNAL_SERVER_ERROR,
        });
    },

    NO_ENOUGH_STOCK({ res }) {
        res.status(HTTP_CODE.NO_ENOUGH_STOCK).json({
            success: false,
            message: MESSAGE.NO_ENOUGH_STOCK,
        });
    },

    TOKEN_EXPIRED({ res, err }) {
        res.status(HTTP_CODE.UNAUTHORIZED).json({
            success: false,
            message: err.message,
            expiredAt: err.expiredAt,
        });
    },
    TOKEN_NEEDED({ res, err }) {
        res.status(HTTP_CODE.UNAUTHORIZED).json({
            success: false,
            message: err.message,
        });
    },
};

module.exports = response;
