const multer = require("multer");

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = error.message || "Something went wrong.";

  if (error instanceof multer.MulterError) {
    statusCode = 400;
    message = error.code === "LIMIT_FILE_SIZE" ? "File size must be below 5 MB." : error.message;
  }

  if (message.includes("Only CSV")) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    message
  });
};

module.exports = {
  errorHandler,
  notFound
};
