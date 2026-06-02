const mongoose = require("mongoose");
const Agent = require("../models/Agent");
const AssignedTask = require("../models/AssignedTask");
const DistributionBatch = require("../models/DistributionBatch");

const getDistributions = async (req, res) => {
  try {
    const batches = await DistributionBatch.find()
      .sort({ createdAt: -1 })
      .populate("agentsUsed", "name email mobile")
      .lean();

    const batchIds = batches.map((batch) => batch._id);
    const counts = await AssignedTask.aggregate([
      {
        $match: {
          batch: { $in: batchIds }
        }
      },
      {
        $group: {
          _id: {
            batch: "$batch",
            agent: "$agent"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const agentIds = [...new Set(counts.map((item) => String(item._id.agent)))];
    const agents = await Agent.find({ _id: { $in: agentIds } }).select("name email mobile").lean();
    const agentMap = new Map(agents.map((agent) => [String(agent._id), agent]));

    const batchMap = new Map();
    counts.forEach((item) => {
      const batchId = String(item._id.batch);
      const agentId = String(item._id.agent);
      const currentItems = batchMap.get(batchId) || [];
      const agent = agentMap.get(agentId);

      currentItems.push({
        agent: agent
          ? {
              id: agent._id,
              name: agent.name,
              email: agent.email,
              mobile: agent.mobile
            }
          : { id: agentId, name: "Deleted agent" },
        count: item.count
      });

      batchMap.set(batchId, currentItems);
    });

    return res.json({
      batches: batches.map((batch) => ({
        id: batch._id,
        fileName: batch.fileName,
        totalRecords: batch.totalRecords,
        status: batch.status,
        createdAt: batch.createdAt,
        agents: batchMap.get(String(batch._id)) || []
      }))
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to load distributions." });
  }
};

const getDistributionByAgent = async (req, res) => {
  try {
    const { agentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({ message: "Invalid agent id." });
    }

    const agent = await Agent.findById(agentId).select("name email mobile").lean();

    if (!agent) {
      return res.status(404).json({ message: "Agent not found." });
    }

    const tasks = await AssignedTask.find({ agent: agentId })
      .sort({ createdAt: -1, rowNumber: 1 })
      .populate("batch", "fileName totalRecords createdAt")
      .lean();

    return res.json({
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile
      },
      tasks: tasks.map((task) => ({
        id: task._id,
        firstName: task.firstName,
        phone: task.phone,
        notes: task.notes,
        rowNumber: task.rowNumber,
        createdAt: task.createdAt,
        batch: task.batch
          ? {
              id: task.batch._id,
              fileName: task.batch.fileName,
              totalRecords: task.batch.totalRecords,
              createdAt: task.batch.createdAt
            }
          : null
      }))
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to load assigned tasks." });
  }
};

const clearDistributions = async (req, res) => {
  try {
    const taskResult = await AssignedTask.deleteMany({});
    const batchResult = await DistributionBatch.deleteMany({});

    return res.json({
      message: "All uploaded records have been cleared.",
      deleted: {
        tasks: taskResult.deletedCount,
        batches: batchResult.deletedCount
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to clear uploaded records." });
  }
};

module.exports = {
  clearDistributions,
  getDistributionByAgent,
  getDistributions
};
