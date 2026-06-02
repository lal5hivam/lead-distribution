import { Plus, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import Alert from "../components/Alert.jsx";
import LoadingButton from "../components/LoadingButton.jsx";

const emptyForm = {
  name: "",
  email: "",
  mobile: "",
  password: ""
};

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const loadAgents = async () => {
    try {
      const { data } = await apiClient.get("/agents");
      setAgents(data.agents || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to load agents.");
      setMessageType("error");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const { data } = await apiClient.post("/agents", formData);
      setAgents((current) => [...current, data.agent]);
      setFormData(emptyForm);
      setMessage("Agent created successfully.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to create agent.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Team</p>
          <h2>Agents</h2>
        </div>
      </div>

      <div className="two-column">
        <form className="tool-panel form-stack" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <h3>Add Agent</h3>
          </div>

          <Alert message={message} type={messageType} />

          <label>
            Name
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Mobile Number
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+919876543210"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <LoadingButton className="primary-button" icon={Plus} isLoading={isLoading}>
            Add Agent
          </LoadingButton>
        </form>

        <div className="tool-panel">
          <div className="panel-heading">
            <h3>Agent List</h3>
            <span className="count-badge">{agents.length}</span>
          </div>

          {isFetching ? (
            <p className="empty-state">Loading agents...</p>
          ) : agents.length === 0 ? (
            <p className="empty-state">No agents added yet.</p>
          ) : (
            <div className="agent-list">
              {agents.map((agent) => (
                <article className="agent-row" key={agent.id}>
                  <div className="agent-avatar">
                    <UserRound size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <strong>{agent.name}</strong>
                    <p>{agent.email}</p>
                    <p>{agent.mobile}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AgentsPage;
