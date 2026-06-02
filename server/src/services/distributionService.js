const buildTaskAssignments = (rows, agents) => {
  const agentCount = agents.length;

  if (agentCount === 0) {
    throw new Error("At least one agent is required before uploading a list.");
  }

  const baseCount = Math.floor(rows.length / agentCount);
  const remainder = rows.length % agentCount;
  const tasks = [];
  const summary = [];
  let cursor = 0;

  agents.forEach((agent, agentIndex) => {
    const itemCount = baseCount + (agentIndex < remainder ? 1 : 0);
    summary.push({
      agent,
      count: itemCount
    });

    for (let localIndex = 0; localIndex < itemCount; localIndex += 1) {
      const row = rows[cursor];

      tasks.push({
        agent: agent._id,
        firstName: row.firstName,
        phone: row.phone,
        notes: row.notes,
        rowNumber: cursor + 2
      });

      cursor += 1;
    }
  });

  return {
    tasks,
    summary
  };
};

module.exports = {
  buildTaskAssignments
};
