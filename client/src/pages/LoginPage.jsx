import { LogIn } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import LoadingButton from "../components/LoadingButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "admin@example.com",
    password: "Admin@123"
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      await login(formData);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="brand-block login-brand">
          <div className="brand-mark">TA</div>
          <div>
            <p className="eyebrow">Admin Login</p>
            <h1>Lead Distribution</h1>
          </div>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <Alert message={message} type="error" />

          <label>
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
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
              autoComplete="current-password"
              required
            />
          </label>

          <LoadingButton className="primary-button" icon={LogIn} isLoading={isLoading}>
            Login
          </LoadingButton>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
