const express = require("express");
const { createAgent, getAgents } = require("../controllers/agentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getAgents).post(protect, createAgent);

module.exports = router;
