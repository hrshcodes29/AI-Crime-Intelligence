import { useState } from "react";
import {
  Brain,
  MapPin,
  ShieldAlert,
  Activity,
  Sparkles,
  Target,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";

import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

const API = "http://127.0.0.1:8000";

export default function Predictions() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [location, setLocation] = useState("");
  const [crimeType, setCrimeType] = useState("All Crime");

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const analyzeRisk = async () => {
    const cleanLocation = location.trim();

    if (!cleanLocation) {
      setError("Please enter a state or UT.");
      setPrediction(null);
      return;
    }

    setLoading(true);
    setPrediction(null);
    setError("");

    try {
      const response = await fetch(`${API}/predict`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: cleanLocation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Prediction API failed."
        );
      }

      if (!data.success) {
        setError(
          data.message ||
            "State/UT not found in NCRB dataset."
        );
        return;
      }

      setPrediction(data);
    } catch (err) {
      console.error("Prediction error:", err);

      setError(
        err.message ||
          "Unable to connect to the AI prediction service."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      analyzeRisk();
    }
  };

  const riskColor =
    prediction?.level === "HIGH"
      ? "text-red-400"
      : prediction?.level === "MODERATE"
      ? "text-yellow-400"
      : "text-green-400";

  const riskBorder =
    prediction?.level === "HIGH"
      ? "border-red-400"
      : prediction?.level === "MODERATE"
      ? "border-yellow-400"
      : "border-green-400";

  const riskBg =
    prediction?.level === "HIGH"
      ? "bg-red-500/10"
      : prediction?.level === "MODERATE"
      ? "bg-yellow-500/10"
      : "bg-green-500/10";

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="lg:ml-72">

        <TopNavbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <section className="p-6 lg:p-10">

          {/* Header */}

          <div>
            <div className="flex items-center gap-2 text-purple-400">

              <Sparkles size={18} />

              <span className="text-xs font-semibold tracking-[0.25em]">
                MACHINE LEARNING ENGINE
              </span>

            </div>

            <h1 className="mt-3 text-3xl font-bold lg:text-4xl">
              AI Crime Prediction
            </h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Search a State or Union Territory to generate
              an AI-based crime prediction using NCRB data.
            </p>
          </div>


          {/* Main Grid */}

          <div className="mt-8 grid gap-6 xl:grid-cols-5">

            {/* Input */}

            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl xl:col-span-2"
            >

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-purple-500/10 p-3">

                  <Brain className="text-purple-400" />

                </div>

                <div>

                  <h2 className="font-semibold">
                    Prediction Parameters
                  </h2>

                  <p className="text-xs text-slate-500">
                    Search a state for prediction
                  </p>

                </div>

              </div>


              {/* State Search */}

              <div className="mt-8">

                <label className="mb-2 block text-sm text-slate-400">
                  State / Union Territory
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setError("");
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search Delhi, Punjab, Haryana..."
                    className="w-full rounded-xl border border-white/10 bg-slate-800/70 py-4 pl-11 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/30"
                  />

                  <Search
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Example: Delhi, Punjab, Haryana, Himachal Pradesh
                </p>

              </div>


              {/* Crime Type */}

              <div className="mt-5">

                <label className="mb-2 block text-sm text-slate-400">
                  Crime Category
                </label>

                <select
                  value={crimeType}
                  onChange={(e) =>
                    setCrimeType(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-800/70 px-4 py-4 text-white outline-none focus:border-purple-400/50"
                >

                  <option>All Crime</option>
                  <option>Theft</option>
                  <option>Fraud</option>
                  <option>Cyber Crime</option>
                  <option>Assault</option>
                  <option>Robbery</option>

                </select>

                <p className="mt-2 text-xs text-slate-500">
                  The current trained model predicts overall
                  IPC crime. Crime category is currently
                  interface-only.
                </p>

              </div>


              {/* Error */}

              {error && (

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400"
                >
                  {error}
                </motion.div>

              )}


              {/* Button */}

              <button
                onClick={analyzeRisk}
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 py-4 font-bold transition hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <Activity
                      className="animate-spin"
                      size={18}
                    />

                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain size={18} />

                    Analyze Risk
                  </>
                )}

              </button>


              {/* Backend status */}

              <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">

                <Target size={15} />

                Powered by trained ML model + NCRB data.

              </div>

            </motion.div>


            {/* Result */}

            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl xl:col-span-3"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-semibold">
                    Prediction Result
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Live response from FastAPI ML backend
                  </p>

                </div>

                <div className="rounded-xl bg-cyan-500/10 p-3">

                  <ShieldAlert className="text-cyan-400" />

                </div>

              </div>


              {/* Empty State */}

              {!prediction && !loading && (

                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">

                  <div className="rounded-full border border-purple-500/20 bg-purple-500/5 p-8">

                    <Brain
                      size={52}
                      className="text-purple-400"
                    />

                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    Awaiting Analysis
                  </h3>

                  <p className="mt-2 max-w-sm text-sm text-slate-500">
                    Enter a state such as Delhi or Punjab
                    and click Analyze Risk.
                  </p>

                </div>

              )}


              {/* Loading */}

              {loading && (

                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">

                  <Activity
                    size={52}
                    className="animate-spin text-purple-400"
                  />

                  <h3 className="mt-6 text-xl font-semibold">
                    Analyzing {location}...
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Running the trained model.
                  </p>

                </div>

              )}


              {/* Result */}

              {prediction && !loading && (

                <div className="mt-8">

                  {/* Risk Score */}

                  <div className="flex flex-col items-center">

                    <div
                      className={`relative flex h-52 w-52 items-center justify-center rounded-full border-[12px] ${riskBorder}/20`}
                    >

                      <div
                        className={`absolute inset-[-12px] rounded-full border-[12px] border-transparent border-t-current border-r-current ${riskColor}`}
                      />

                      <div className="text-center">

                        <p className="text-5xl font-bold">
                          {prediction.score}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          / 100
                        </p>

                        <p
                          className={`mt-1 text-sm font-semibold ${riskColor}`}
                        >
                          {prediction.level} RISK
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* State */}

                  <div
                    className={`mt-8 rounded-xl ${riskBg} p-5 text-center`}
                  >

                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Analyzed Location
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                      {prediction.location}
                    </h3>

                  </div>


                  {/* Prediction Details */}

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">

                    <ResultCard
                      title="Predicted Cases"
                      value={
                        Number(
                          prediction.predicted_cases || 0
                        ).toLocaleString()
                      }
                    />

                    <ResultCard
                      title="Predicted Crime Rate"
                      value={
                        prediction.predicted_rate
                      }
                    />

                    <ResultCard
                      title="Risk Score"
                      value={`${prediction.score}/100`}
                    />

                  </div>


                  {/* Historical Comparison */}

                  <div className="mt-5">

                    <h3 className="mb-3 text-sm font-semibold text-slate-300">
                      Historical vs Predicted
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div className="rounded-xl border border-white/5 bg-slate-800/40 p-5">

                        <p className="text-xs text-slate-500">
                          Historical 2019 Cases
                        </p>

                        <p className="mt-2 text-2xl font-bold">
                          {Number(
                            prediction.historical_2019_cases || 0
                          ).toLocaleString()}
                        </p>

                      </div>

                      <div className="rounded-xl border border-white/5 bg-slate-800/40 p-5">

                        <p className="text-xs text-slate-500">
                          Historical 2019 Crime Rate
                        </p>

                        <p className="mt-2 text-2xl font-bold">
                          {prediction.historical_2019_rate}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* Explanation */}

                  <div className="mt-5 rounded-xl border border-white/5 bg-slate-800/40 p-5">

                    <div className="flex gap-3">

                      <ShieldAlert
                        className={`mt-0.5 shrink-0 ${riskColor}`}
                        size={20}
                      />

                      <div>

                        <p
                          className={`font-semibold ${riskColor}`}
                        >
                          {prediction.level} Risk Detected
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          The trained ML model predicts approximately{" "}
                          <span className="font-semibold text-white">
                            {Number(
                              prediction.predicted_cases || 0
                            ).toLocaleString()}
                          </span>{" "}
                          cases for{" "}
                          <span className="font-semibold text-white">
                            {prediction.location}
                          </span>
                          , with an estimated crime rate of{" "}
                          <span className="font-semibold text-white">
                            {prediction.predicted_rate}
                          </span>
                          .
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              )}

            </motion.div>

          </div>


          {/* Info Cards */}

          <div className="mt-6 grid gap-6 md:grid-cols-3">

            <InfoCard
              icon={
                <Brain className="text-purple-400" />
              }
              title="Machine Learning"
              text="The backend uses the trained crime prediction model."
            />

            <InfoCard
              icon={
                <Activity className="text-cyan-400" />
              }
              title="Live API"
              text="Every analysis request is sent directly to the FastAPI backend."
            />

            <InfoCard
              icon={
                <ShieldAlert className="text-yellow-400" />
              }
              title="Risk Assessment"
              text="The API returns predicted cases, crime rate, risk level and score."
            />

          </div>

        </section>

      </main>

    </div>
  );
}

function ResultCard({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-800/60 p-5">

      <p className="text-xs text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl"
    >

      {icon}

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {text}
      </p>

    </motion.div>
  );
}