const mongoose = require("mongoose");

const distributionBatchSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },
    totalRecords: {
      type: Number,
      required: true,
      min: 0
    },
    agentsUsed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent"
      }
    ],
    status: {
      type: String,
      enum: ["completed", "failed"],
      default: "completed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DistributionBatch", distributionBatchSchema);
