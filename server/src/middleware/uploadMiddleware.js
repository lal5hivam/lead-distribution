const multer = require("multer");
const path = require("path");

const allowedExtensions = [".csv", ".xlsx", ".xls"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return cb(new Error("Only CSV, XLSX, and XLS files are allowed."));
    }

    cb(null, true);
  }
});

module.exports = upload;
