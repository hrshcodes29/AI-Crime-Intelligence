import { Mail, Lock, Shield, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";

const API = "https://ai-crime-intelligence-3.onrender.com";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      if (data.user) {
        localStorage.setItem(
          "crime_ai_user",
          JSON.stringify(data.user)
        );
      }

      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      console.error("Login error:", err);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4">

      <AnimatedBackground />

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="relative z-10 w-full max-w-[420px] rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl sm:p-10"
      >

        {/* Logo */}
        <div className="flex justify-center">
          <div className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 p-4 shadow-lg shadow-cyan-500/30">
            <Shield className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-center text-3xl font-bold text-white">
          AI Crime Intelligence
        </h1>

        <p className="mt-2 text-center text-gray-400">
          Smart Crime Analysis & Prediction Platform
        </p>

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-8">

          {/* Email */}
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="w-full rounded-xl bg-slate-800/80 py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Password */}
          <div className="relative mt-4">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-xl bg-slate-800/80 py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 py-4 font-bold text-white transition duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Authenticating...
              </span>
            ) : (
              "Secure Login"
            )}
          </button>

        </form>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            Create Account
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-gray-500">
          AI Powered • ML Based • Secure Access
        </p>

      </motion.div>
    </div>
  );
}