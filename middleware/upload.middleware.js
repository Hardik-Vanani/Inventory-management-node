const path = require("path");
const multer = require("multer");

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, //* Limit file size to 5 MB

    fileFilter: (req, file, cb) => {
        const fileType = /jpeg|jpg|png/;
        const mimetype = fileType.test(file.mimetype);
        const extname = fileType.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: Images Only!"));
    },
});

module.exports = upload;
