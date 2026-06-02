const requiredColumns = ["FirstName", "Phone", "Notes"];

const isValidEmail = (email = "") => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

const isValidMobile = (mobile = "") => {
  return /^\+[1-9]\d{1,3}[ -]?\d{6,14}$/.test(String(mobile).trim());
};

const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    return "Email and password are required.";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address.";
  }

  return null;
};

const validateAgentInput = ({ name, email, mobile, password }) => {
  if (!name || !email || !mobile || !password) {
    return "Name, email, mobile number, and password are required.";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address.";
  }

  if (!isValidMobile(mobile)) {
    return "Mobile number must include a country code, for example +919876543210.";
  }

  if (String(password).length < 6) {
    return "Password must be at least 6 characters long.";
  }

  return null;
};

const getValueByColumn = (row, columnName) => {
  const matchingKey = Object.keys(row).find(
    (key) => key.trim().toLowerCase() === columnName.toLowerCase()
  );

  return matchingKey ? row[matchingKey] : undefined;
};

const validateListRows = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return {
      isValid: false,
      error: "The uploaded file is empty."
    };
  }

  const uploadedColumns = Object.keys(rows[0]).map((key) => key.trim().toLowerCase());
  const missingColumns = requiredColumns.filter(
    (column) => !uploadedColumns.includes(column.toLowerCase())
  );

  if (missingColumns.length > 0) {
    return {
      isValid: false,
      error: `Missing required column(s): ${missingColumns.join(", ")}.`
    };
  }

  const validationErrors = [];
  const cleanedRows = rows.map((row, index) => {
    const firstName = String(getValueByColumn(row, "FirstName") ?? "").trim();
    const phone = String(getValueByColumn(row, "Phone") ?? "").trim();
    const notes = String(getValueByColumn(row, "Notes") ?? "").trim();
    const rowNumber = index + 2;

    if (!firstName) {
      validationErrors.push(`Row ${rowNumber}: FirstName is required.`);
    }

    if (!phone) {
      validationErrors.push(`Row ${rowNumber}: Phone is required.`);
    } else if (!/^[0-9+\-\s()]{5,20}$/.test(phone)) {
      validationErrors.push(`Row ${rowNumber}: Phone must be a valid number.`);
    }

    if (!notes) {
      validationErrors.push(`Row ${rowNumber}: Notes is required.`);
    }

    return {
      firstName,
      phone,
      notes
    };
  });

  if (validationErrors.length > 0) {
    return {
      isValid: false,
      error: validationErrors.slice(0, 5).join(" ")
    };
  }

  return {
    isValid: true,
    rows: cleanedRows
  };
};

module.exports = {
  isValidEmail,
  isValidMobile,
  validateAgentInput,
  validateListRows,
  validateLoginInput
};
