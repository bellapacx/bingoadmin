import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log("Attempting login...");
      const res = await axios.post("http://127.0.0.1:8000/login", { username, password });
      console.log("Login success:", res.data);
      localStorage.setItem("token", res.data.token);
      onLogin();            // Notify parent about login state change
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed", err.response || err.message);
      setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <input
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-3 mb-6 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors py-3 rounded font-semibold"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
