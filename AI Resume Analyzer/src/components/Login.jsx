import { useState } from "react";
import axios from "axios";

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Login button clicked");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      console.log(res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      console.log(res.data);

      alert("Login Successful");

      onLogin();
    } catch (error) {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-purple-950">
      <div className="bg-zinc-800/80 backdrop-blur-md p-8 rounded-2xl w-96 border border-purple-500 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center">
          AI Resume Analyzer
        </h1>

        <p className="text-zinc-400 text-center mb-5">Sign in to continue</p>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-lg bg-zinc-700 text-white border border-zinc-600 outline-none focus:border-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-zinc-700 text-white border border-zinc-600 outline-none focus:border-purple-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 py-3 rounded"
        >
          Login
        </button>
        <p className="text-center text-zinc-400 mt-4">Don't have an account?</p>

        <button
          onClick={onSwitchToRegister}
          className="w-full mt-2 border border-purple-500 py-3 rounded-lg"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default Login;
