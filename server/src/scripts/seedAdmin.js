require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = "admin@example.com";
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const password = await bcrypt.hash("Admin@123", 10);

    await Admin.create({
      name: "Demo Admin",
      email,
      password
    });

    console.log("Admin created successfully.");
    console.log("Email: admin@example.com");
    console.log("Password: Admin@123");
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedAdmin();
