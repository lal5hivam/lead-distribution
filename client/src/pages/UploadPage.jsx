import { UploadCloud } from "lucide-react";
import { useState } from "react";
import apiClient from "../api/apiClient";
import Alert from "../components/Alert.jsx";
import LoadingButton from "../components/LoadingButton.jsx";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResult(null);
    setMessage("");

    if (!file) {
      setMessage("Please choose a file to upload.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setIsLoading(true);

    try {
      const { data } = await apiClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setResult(data);
      setMessage(data.message);
      setMessageType("success");
      setFile(null);
      event.target.reset();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to upload file.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Upload</p>
          <h2>List Distribution</h2>
        </div>
      </div>

      <div className="tool-panel upload-panel">
        <form className="form-stack" onSubmit={handleSubmit}>
          <Alert message={message} type={messageType} />

          <label>
            List File
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </label>

          <LoadingButton className="primary-button" icon={UploadCloud} isLoading={isLoading}>
            Upload and Distribute
          </LoadingButton>
        </form>

        {result ? (
          <div className="result-block">
            <div className="panel-heading">
              <h3>{result.batch.fileName}</h3>
              <span className="count-badge">{result.batch.totalRecords} records</span>
            </div>
            <div className="summary-grid">
              {result.summary.map((item) => (
                <article className="summary-card" key={item.agent.id}>
                  <strong>{item.agent.name}</strong>
                  <p>{item.agent.email}</p>
                  <span>{item.count} items</span>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default UploadPage;
