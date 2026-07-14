import { useState } from "react";
import axios from "axios";

function Register({ onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username: name,
        email,
        password,
      });

      alert("Registration Successful");

      onSwitchToLogin();
    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-purple-950">
      <div className="bg-zinc-800/80 backdrop-blur-md p-8 rounded-2xl w-96 border border-purple-500 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>

        <p className="text-zinc-400 text-center mb-5">Register to continue</p>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          autoComplete="new-password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-zinc-700 text-white placeholder-zinc-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-purple-600 py-3 rounded-lg"
        >
          Register
        </button>
        <p className="text-center text-zinc-400 mt-4">
          Already have an account?
        </p>

        <button
          onClick={onSwitchToLogin}
          className="w-full mt-2 border border-purple-500 py-3 rounded-lg"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default Register;
