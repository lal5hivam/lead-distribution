const csv = require("csv-parser");
const path = require("path");
const { Readable } = require("stream");
const XLSX = require("xlsx");

const parseCsvBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const rows = [];

    Readable.from([buffer])
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim()
        })
      )
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", (error) => reject(error));
  });
};

const parseExcelBuffer = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return [];
  }

  const worksheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json(worksheet, { defval: "" });
};

const parseUploadedFile = async (file) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === ".csv") {
    return parseCsvBuffer(file.buffer);
  }

  if (extension === ".xlsx" || extension === ".xls") {
    return parseExcelBuffer(file.buffer);
  }

  throw new Error("Unsupported file type.");
};

module.exports = {
  parseUploadedFile
};
