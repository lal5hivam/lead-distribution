const express = require("express");
const {
  clearDistributions,
  getDistributionByAgent,
  getDistributions
} = require("../controllers/distributionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getDistributions);
router.delete("/", protect, clearDistributions);
router.get("/:agentId", protect, getDistributionByAgent);

module.exports = router;
