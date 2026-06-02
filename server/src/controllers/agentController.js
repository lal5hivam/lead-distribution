const bcrypt = require("bcryptjs");
const Agent = require("../models/Agent");
const { validateAgentInput } = require("../utils/validators");

const toAgentResponse = (agent) => ({
  id: agent._id,
  name: agent.name,
  email: agent.email,
  mobile: agent.mobile,
  createdAt: agent.createdAt
});

const createAgent = async (req, res) => {
  try {
    const validationError = validateAgentInput(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { name, email, mobile, password } = req.body;
    const existingAgent = await Agent.findOne({ email: email.toLowerCase().trim() });

    if (existingAgent) {
      return res.status(409).json({ message: "An agent with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const agent = await Agent.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password: hashedPassword
    });

    return res.status(201).json({
      message: "Agent created successfully.",
      agent: toAgentResponse(agent)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to create agent. Please try again." });
  }
};

const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: 1 });

    return res.json({
      agents: agents.map(toAgentResponse)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to load agents." });
  }
};

module.exports = {
  createAgent,
  getAgents
};
