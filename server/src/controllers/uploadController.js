const Agent = require("../models/Agent");
const AssignedTask = require("../models/AssignedTask");
const DistributionBatch = require("../models/DistributionBatch");
const { buildTaskAssignments } = require("../services/distributionService");
const { parseUploadedFile } = require("../services/fileParserService");
const { validateListRows } = require("../utils/validators");

const uploadListFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a CSV, XLSX, or XLS file." });
    }

    const parsedRows = await parseUploadedFile(req.file);
    const validationResult = validateListRows(parsedRows);

    if (!validationResult.isValid) {
      return res.status(400).json({ message: validationResult.error });
    }

    const agents = await Agent.find().sort({ createdAt: 1 });

    if (agents.length === 0) {
      return res.status(400).json({
        message: "Please add at least one agent before uploading a list."
      });
    }

    const { tasks, summary } = buildTaskAssignments(validationResult.rows, agents);
    const batch = await DistributionBatch.create({
      fileName: req.file.originalname,
      uploadedBy: req.user._id,
      totalRecords: validationResult.rows.length,
      agentsUsed: agents.map((agent) => agent._id),
      status: "completed"
    });

    await AssignedTask.insertMany(
      tasks.map((task) => ({
        ...task,
        batch: batch._id
      }))
    );

    return res.status(201).json({
      message: "File uploaded and distributed successfully.",
      batch: {
        id: batch._id,
        fileName: batch.fileName,
        totalRecords: batch.totalRecords,
        createdAt: batch.createdAt
      },
      summary: summary.map((item) => ({
        agent: {
          id: item.agent._id,
          name: item.agent.name,
          email: item.agent.email,
          mobile: item.agent.mobile
        },
        count: item.count
      }))
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: error.message || "Unable to process uploaded file."
    });
  }
};

module.exports = {
  uploadListFile
};
