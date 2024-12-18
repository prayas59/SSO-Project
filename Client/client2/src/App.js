import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";

// Login Page
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3000/login",
        { email, password },
        { withCredentials: true }
      );
      window.location.reload(); // Reload to show logged-in page
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

// Client Page (If Logged In)
const ClientPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/user", { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch(() => setUser(null)); // Handle no user (unauthorized)
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:3000/logout", {}, { withCredentials: true })
      .then(() => {
        window.location.reload();
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        {user ? (
          <>
            <h2>Welcome, {user.name}</h2>
            <h2>Your Email Id is: {user.email}</h2>
            <p>You are logged in to Client 2.</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white p-2 rounded mt-4"
            >
              Logout
            </button>
          </>
        ) : (
          <LoginPage />
        )}
      </div>
    </div>
  );
};

// Dashboard Page (Redirects to Clients)
const Dashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <div>
          <Link to="http://localhost:4000/client">
            <button className="bg-blue-500 text-white p-3 rounded w-full">
              Go to Client 1
            </button>
          </Link>
        </div>
        <div>
          <Link to="http://localhost:4001/client">
            <button className="bg-green-500 text-white p-3 rounded w-full">
              Go to Client 2
            </button>
          </Link>
        </div>
        <div>
          <Link to="http://localhost:4002/client">
            <button className="bg-red-500 text-white p-3 rounded w-full">
              Go to Client 3
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/client" element={<ClientPage />} />
        <Route path="/client" element={<ClientPage />} />
        <Route path="/client" element={<ClientPage />} />
      </Routes>
    </Router>
  );
};

export default App;
