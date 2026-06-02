import { ListChecks, RefreshCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import Alert from "../components/Alert.jsx";

const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
};

const DistributionsPage = () => {
  const [agents, setAgents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedAgentTasks, setSelectedAgentTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskLoading, setIsTaskLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const loadData = async () => {
    setMessage("");
    setIsLoading(true);

    try {
      const [agentResponse, distributionResponse] = await Promise.all([
        apiClient.get("/agents"),
        apiClient.get("/distributions")
      ]);
      const nextAgents = agentResponse.data.agents || [];
      setAgents(nextAgents);
      setBatches(distributionResponse.data.batches || []);

      if (!selectedAgentId && nextAgents.length > 0) {
        setSelectedAgentId(nextAgents[0].id);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to load distributions.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      if (!selectedAgentId) {
        setSelectedAgentTasks([]);
        return;
      }

      setIsTaskLoading(true);

      try {
        const { data } = await apiClient.get(`/distributions/${selectedAgentId}`);
        setSelectedAgentTasks(data.tasks || []);
      } catch (error) {
        setMessage(error.response?.data?.message || "Unable to load assigned tasks.");
        setMessageType("error");
      } finally {
        setIsTaskLoading(false);
      }
    };

    loadTasks();
  }, [selectedAgentId]);

  const handleClearUploads = async () => {
    const shouldClear = window.confirm(
      "Clear all uploaded batches and assigned records? Agents and admin login will remain unchanged."
    );

    if (!shouldClear) {
      return;
    }

    setIsClearing(true);
    setMessage("");

    try {
      const { data } = await apiClient.delete("/distributions");
      setBatches([]);
      setSelectedAgentTasks([]);
      setMessage(data.message || "All uploaded records have been cleared.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to clear uploaded records.");
      setMessageType("error");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Distribution</p>
          <h2>Assigned Lists</h2>
        </div>
        <div className="page-actions">
          <button
            className="danger-button small-button"
            type="button"
            onClick={handleClearUploads}
            disabled={isLoading || isClearing || batches.length === 0}
          >
            <Trash2 size={16} aria-hidden="true" />
            <span>{isClearing ? "Clearing..." : "Clear uploads"}</span>
          </button>
          <button className="secondary-button" type="button" onClick={loadData}>
            <RefreshCcw size={18} aria-hidden="true" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <Alert message={message} type={messageType} />

      <div className="two-column distribution-grid">
        <div className="tool-panel">
          <div className="panel-heading">
            <h3>Upload Batches</h3>
            <ListChecks size={18} aria-hidden="true" />
          </div>

          {isLoading ? (
            <p className="empty-state">Loading batches...</p>
          ) : batches.length === 0 ? (
            <p className="empty-state">No distributed lists yet.</p>
          ) : (
            <div className="batch-list">
              {batches.map((batch) => (
                <article className="batch-row" key={batch.id}>
                  <div className="batch-topline">
                    <strong>{batch.fileName}</strong>
                    <span>{batch.totalRecords} records</span>
                  </div>
                  <p>{formatDate(batch.createdAt)}</p>
                  <div className="mini-summary">
                    {batch.agents.map((item) => (
                      <span key={`${batch.id}-${item.agent.id}`}>
                        {item.agent.name}: {item.count}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="tool-panel">
          <div className="panel-heading">
            <h3>Agent Tasks</h3>
            <span className="count-badge">{selectedAgentTasks.length}</span>
          </div>

          <div className="segmented-control">
            {agents.map((agent) => (
              <button
                key={agent.id}
                className={agent.id === selectedAgentId ? "active" : ""}
                type="button"
                onClick={() => setSelectedAgentId(agent.id)}
              >
                {agent.name}
              </button>
            ))}
          </div>

          {isTaskLoading ? (
            <p className="empty-state">Loading tasks...</p>
          ) : selectedAgentTasks.length === 0 ? (
            <p className="empty-state">No tasks found for this agent.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Phone</th>
                    <th>Notes</th>
                    <th>File</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAgentTasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.firstName}</td>
                      <td>{task.phone}</td>
                      <td>{task.notes}</td>
                      <td>{task.batch?.fileName || "Unavailable"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DistributionsPage;
