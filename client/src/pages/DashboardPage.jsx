import { FileSpreadsheet, ListChecks, Users } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import Alert from "../components/Alert.jsx";

const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
};

const DashboardPage = () => {
  const [agents, setAgents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [agentResponse, distributionResponse] = await Promise.all([
          apiClient.get("/agents"),
          apiClient.get("/distributions")
        ]);

        setAgents(agentResponse.data.agents || []);
        setBatches(distributionResponse.data.batches || []);
      } catch (error) {
        setMessage(error.response?.data?.message || "Unable to load dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalAssigned = batches.reduce((sum, batch) => sum + batch.totalRecords, 0);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Dashboard</h2>
        </div>
      </div>

      <Alert message={message} type="error" />

      <div className="stats-grid">
        <article className="stat-card">
          <Users size={22} aria-hidden="true" />
          <div>
            <span>{isLoading ? "--" : agents.length}</span>
            <p>Agents</p>
          </div>
        </article>
        <article className="stat-card">
          <FileSpreadsheet size={22} aria-hidden="true" />
          <div>
            <span>{isLoading ? "--" : batches.length}</span>
            <p>Uploads</p>
          </div>
        </article>
        <article className="stat-card">
          <ListChecks size={22} aria-hidden="true" />
          <div>
            <span>{isLoading ? "--" : totalAssigned}</span>
            <p>Assigned Items</p>
          </div>
        </article>
      </div>

      <div className="tool-panel">
        <div className="panel-heading">
          <h3>Recent Uploads</h3>
        </div>

        {batches.length === 0 ? (
          <p className="empty-state">No uploaded lists yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>File</th>
                  <th>Records</th>
                  <th>Status</th>
                  <th>Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {batches.slice(0, 5).map((batch) => (
                  <tr key={batch.id}>
                    <td>{batch.fileName}</td>
                    <td>{batch.totalRecords}</td>
                    <td>
                      <span className="status-pill">{batch.status}</span>
                    </td>
                    <td>{formatDate(batch.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardPage;
