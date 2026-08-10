import {
  User,
  Mail,
  Lock,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";

const API = "http://127.0.0.1:8000";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      setError("Please fill all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Registration failed."
        );
        return;
      }

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);

    } catch (err) {
      console.error("Registration error:", err);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 py-8">

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
        className="relative z-10 w-full max-w-[440px] rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl sm:p-10"
      >

        {/* Logo */}

        <div className="flex justify-center">

          <div className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 p-4 shadow-lg shadow-cyan-500/30">

            <Shield
              className="h-10 w-10 text-white"
            />

          </div>

        </div>


        {/* Heading */}

        <h1 className="mt-6 text-center text-3xl font-bold text-white">
          Create Account
        </h1>

        <p className="mt-2 text-center text-gray-400">
          Join the AI Crime Intelligence Platform
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


        {/* Success */}

        {success && (

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">

            <CheckCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <p>{success}</p>

          </div>

        )}


        {/* Form */}

        <form
          onSubmit={handleRegister}
          className="mt-8"
        >

          {/* Name */}

          <div className="relative">

            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              autoComplete="name"
              required
              className="w-full rounded-xl bg-slate-800/80 py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-400"
            />

          </div>


          {/* Email */}

          <div className="relative mt-4">

            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
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
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="new-password"
              required
              className="w-full rounded-xl bg-slate-800/80 py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-400"
            />

          </div>


          {/* Confirm Password */}

          <div className="relative mt-4">

            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              autoComplete="new-password"
              required
              className="w-full rounded-xl bg-slate-800/80 py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-400"
            />

          </div>


          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 py-4 font-bold text-white transition duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (

              <span className="flex items-center gap-2">

                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                Creating Account...

              </span>

            ) : (

              "Create Account"

            )}

          </button>

        </form>


        {/* Login */}

        <p className="mt-6 text-center text-sm text-gray-400">

          Already have an account?{" "}

          <Link
            to="/login"
            className="font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            Secure Login
          </Link>

        </p>


        <p className="mt-4 text-center text-xs text-gray-500">
          AI Powered • ML Based • Secure Access
        </p>

      </motion.div>

    </div>
  );
}