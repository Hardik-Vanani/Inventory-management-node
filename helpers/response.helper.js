const { HTTP_CODE, MESSAGE } = require("../json/enum.json");

const response = {
    OK({ res, message = MESSAGE.OK, count, payload = {} }) {
        res.status(HTTP_CODE.OK).json({
            success: true,
            message,
            count,
            payload,
        });
    },

    CREATED({ res, message = MESSAGE.CREATED, payload = {} }) {
        res.status(HTTP_CODE.CREATED).json({
            success: true,
            message,
            payload,
        });
    },

    ALL_REQUIRED({ res, payload = {}, message = MESSAGE.ALL_REQUIRED }) {
        res.status(HTTP_CODE.ALL_REQUIRED).json({
            success: false,
            message,
            payload,
        });
    },

    NOT_FOUND({ res, message = MESSAGE.NOT_FOUND }) {
        res.status(HTTP_CODE.NOT_FOUND).json({
            success: false,
            message,
        });
    },

    UNAUTHORIZED({ res, message = MESSAGE.UNAUTHORIZED }) {
        res.status(HTTP_CODE.UNAUTHORIZED).json({
            success: false,
            message,
        });
    },

    EXISTED({ res, message = MESSAGE.EXISTED }) {
        res.status(HTTP_CODE.EXISTED).json({
            success: false,
            message
        });
    },

    BAD_REQUEST({ res, message = MESSAGE.BAD_REQUEST }) {
        res.status(HTTP_CODE.BAD_REQUEST).json({
            success: false,
            message,
        });
    },

    INTERNAL_SERVER_ERROR({ res, message = MESSAGE.INTERNAL_SERVER_ERROR }) {
        res.status(HTTP_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message
        });
    },

    NO_ENOUGH_STOCK({ res, message = MESSAGE.NO_ENOUGH_STOCK }) {
        res.status(HTTP_CODE.NO_ENOUGH_STOCK).json({
            success: false,
            message,
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
