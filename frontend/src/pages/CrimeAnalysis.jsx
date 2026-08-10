import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Shield,
  Search,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import { motion } from "framer-motion";

import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

const API = "http://127.0.0.1:8000";

export default function CrimeAnalysis() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API}/crime-analysis`);

        if (!response.ok) {
          throw new Error("Failed to load crime analysis data");
        }

        const result = await response.json();

        setData(
          Array.isArray(result.states)
            ? result.states
            : []
        );
      } catch (err) {
        console.error("Crime analysis error:", err);

        setError(
          "Unable to connect to crime analysis backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, []);

  const normalize = (value) => {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  };

  const filteredData = useMemo(() => {
    const value = normalize(search);

    if (!value) {
      return data;
    }

    return data.filter((item) =>
      normalize(item.state).includes(value)
    );
  }, [data, search]);

  const selectedState = useMemo(() => {
    const value = normalize(search);

    if (!value) {
      return null;
    }

    return (
      data.find(
        (item) => normalize(item.state) === value
      ) ||
      data.find(
        (item) => normalize(item.state).includes(value)
      )
    );
  }, [data, search]);

  const averageRate = useMemo(() => {
    if (!data.length) {
      return 0;
    }

    const validRates = data
      .map((item) => Number(item.crime_rate))
      .filter((rate) => Number.isFinite(rate));

    if (!validRates.length) {
      return 0;
    }

    return (
      validRates.reduce(
        (sum, rate) => sum + rate,
        0
      ) / validRates.length
    );
  }, [data]);

  const selectedRisk = useMemo(() => {
    if (!selectedState) {
      return null;
    }

    const rate = Number(
      selectedState.crime_rate || 0
    );

    if (averageRate === 0) {
      return {
        level: "LOW",
        score: 30,
        percentage: 30,
      };
    }

    const ratio = rate / averageRate;

    if (ratio >= 1.5) {
      return {
        level: "HIGH",
        score: 85,
        percentage: Math.min(
          95,
          Math.round(ratio * 50)
        ),
      };
    }

    if (ratio >= 1) {
      return {
        level: "MODERATE",
        score: 60,
        percentage: Math.min(
          75,
          Math.round(ratio * 40)
        ),
      };
    }

    return {
      level: "LOW",
      score: 30,
      percentage: Math.max(
        15,
        Math.round(ratio * 40)
      ),
    };
  }, [selectedState, averageRate]);

  const metrics = useMemo(() => {
    if (!data.length) {
      return {
        totalCases: 0,
        averageRate: 0,
        highRateStates: 0,
        growth: 0,
      };
    }

    const totalCases = data.reduce(
      (sum, item) =>
        sum + Number(item["2019"] || 0),
      0
    );

    const highRateStates = data.filter(
      (item) =>
        Number(item.crime_rate || 0) >=
        averageRate
    ).length;

    const total2017 = data.reduce(
      (sum, item) =>
        sum + Number(item["2017"] || 0),
      0
    );

    const total2019 = data.reduce(
      (sum, item) =>
        sum + Number(item["2019"] || 0),
      0
    );

    const growth =
      total2017 === 0
        ? 0
        : ((total2019 - total2017) /
            total2017) *
          100;

    return {
      totalCases,
      averageRate,
      highRateStates,
      growth,
    };
  }, [data, averageRate]);

  const topStates = useMemo(() => {
    return [...data]
      .sort(
        (a, b) =>
          Number(b["2019"] || 0) -
          Number(a["2019"] || 0)
      )
      .slice(0, 10);
  }, [data]);

  const trendData = useMemo(() => {
    if (!data.length) {
      return [];
    }

    return [
      {
        year: "2017",
        cases: data.reduce(
          (sum, item) =>
            sum + Number(item["2017"] || 0),
          0
        ),
      },
      {
        year: "2018",
        cases: data.reduce(
          (sum, item) =>
            sum + Number(item["2018"] || 0),
          0
        ),
      },
      {
        year: "2019",
        cases: data.reduce(
          (sum, item) =>
            sum + Number(item["2019"] || 0),
          0
        ),
      },
    ];
  }, [data]);

  const riskColor =
    selectedRisk?.level === "HIGH"
      ? "text-red-400"
      : selectedRisk?.level === "MODERATE"
      ? "text-yellow-400"
      : "text-green-400";

  const riskBorder =
    selectedRisk?.level === "HIGH"
      ? "border-red-400"
      : selectedRisk?.level === "MODERATE"
      ? "border-yellow-400"
      : "border-green-400";

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="lg:ml-72">

        <TopNavbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <section className="p-6 lg:p-10">

          {/* Header */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-between gap-5 md:flex-row md:items-end"
          >

            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-cyan-400">
                INTELLIGENCE ANALYTICS
              </p>

              <h1 className="mt-2 text-3xl font-bold lg:text-4xl">
                Crime Analysis
              </h1>

              <p className="mt-2 text-slate-400">
                NCRB-based state crime trends,
                rates and historical analysis.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              <Activity size={16} />
              Live Dataset
            </div>

          </motion.div>

          {/* Error */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Overall Metrics */}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <MetricCard
              title="Total Cases 2019"
              value={
                loading
                  ? "..."
                  : metrics.totalCases.toLocaleString()
              }
              change="NCRB"
              icon={BarChart3}
            />

            <MetricCard
              title="Average Crime Rate"
              value={
                loading
                  ? "..."
                  : metrics.averageRate.toFixed(2)
              }
              change="Per lakh"
              icon={TrendingUp}
            />

            <MetricCard
              title="Above Average States"
              value={
                loading
                  ? "..."
                  : metrics.highRateStates
              }
              change="Risk indicator"
              icon={AlertTriangle}
            />

            <MetricCard
              title="2017 → 2019 Growth"
              value={
                loading
                  ? "..."
                  : `${metrics.growth.toFixed(1)}%`
              }
              change="Historical"
              icon={Shield}
            />

          </div>

          {/* Search */}

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search state e.g. Delhi, Punjab, Haryana..."
                className="w-full rounded-xl border border-white/10 bg-slate-800/70 py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-400/50"
              />

            </div>

          </div>

          {/* Selected State */}

          {selectedState && selectedRisk && (

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-6 rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 backdrop-blur-xl"
            >

              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                <div>

                  <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                    STATE ANALYSIS
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {selectedState.state}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Individual state crime intelligence
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-xs text-slate-500">
                    Risk Level
                  </p>

                  <p
                    className={`mt-1 text-3xl font-bold ${riskColor}`}
                  >
                    {selectedRisk.level}
                  </p>

                  <p className={`text-sm ${riskColor}`}>
                    Score: {selectedRisk.score}/100
                  </p>

                </div>

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <StateStat
                  title="2017 Cases"
                  value={Number(
                    selectedState["2017"]
                  ).toLocaleString()}
                />

                <StateStat
                  title="2018 Cases"
                  value={Number(
                    selectedState["2018"]
                  ).toLocaleString()}
                />

                <StateStat
                  title="2019 Cases"
                  value={Number(
                    selectedState["2019"]
                  ).toLocaleString()}
                />

                <StateStat
                  title="Crime Rate"
                  value={Number(
                    selectedState.crime_rate
                  ).toFixed(2)}
                  highlight
                />

              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                <div className="rounded-xl bg-slate-800/50 p-4">

                  <p className="text-xs text-slate-500">
                    Comparison with dataset average
                  </p>

                  <p className="mt-2 text-lg font-semibold">

                    {Number(
                      selectedState.crime_rate
                    ) >= averageRate
                      ? "Above average crime rate"
                      : "Below average crime rate"}

                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Dataset average:{" "}
                    {averageRate.toFixed(2)}
                  </p>

                </div>

                <div
                  className={`rounded-xl border ${riskBorder}/20 bg-slate-800/50 p-4`}
                >

                  <p className="text-xs text-slate-500">
                    AI Risk Indicator
                  </p>

                  <p
                    className={`mt-2 text-lg font-semibold ${riskColor}`}
                  >
                    {selectedRisk.percentage}% Risk Index
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Based on the state's crime rate
                    relative to the dataset average.
                  </p>

                </div>

              </div>

            </motion.div>

          )}

          {search && !selectedState && !loading && (

            <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6 text-center">

              <Search
                className="mx-auto text-yellow-400"
                size={30}
              />

              <p className="mt-3 font-semibold">
                State not found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try Delhi, Punjab, Haryana or Himachal Pradesh.
              </p>

            </div>

          )}

          {/* Historical Trend */}

          <div className="mt-6 grid gap-6 xl:grid-cols-3">

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl xl:col-span-2"
            >

              <div className="mb-6">

                <h2 className="text-xl font-semibold">
                  Historical Crime Trend
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Total reported IPC cases across states
                </p>

              </div>

              <div className="h-80">

                {loading ? (

                  <div className="flex h-full items-center justify-center text-cyan-400">
                    Loading dataset...
                  </div>

                ) : (

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <AreaChart data={trendData}>

                      <defs>

                        <linearGradient
                          id="crimeAnalysisGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >

                          <stop
                            offset="5%"
                            stopColor="#22d3ee"
                            stopOpacity={0.35}
                          />

                          <stop
                            offset="95%"
                            stopColor="#22d3ee"
                            stopOpacity={0}
                          />

                        </linearGradient>

                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#1e293b"
                      />

                      <XAxis
                        dataKey="year"
                        stroke="#64748b"
                      />

                      <YAxis
                        stroke="#64748b"
                        tickFormatter={(value) =>
                          `${Math.round(
                            value / 1000
                          )}k`
                        }
                      />

                      <Tooltip
                        formatter={(value) =>
                          Number(value).toLocaleString()
                        }
                        contentStyle={{
                          background: "#0f172a",
                          border:
                            "1px solid #1e293b",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="cases"
                        stroke="#22d3ee"
                        strokeWidth={3}
                        fill="url(#crimeAnalysisGradient)"
                      />

                    </AreaChart>

                  </ResponsiveContainer>

                )}

              </div>

            </motion.div>

            {/* Selected/Overall Risk */}

            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl"
            >

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-red-500/10 p-3">

                  <AlertTriangle
                    className="text-red-400"
                  />

                </div>

                <div>

                  <h2 className="font-semibold">
                    {selectedState
                      ? `${selectedState.state} Risk`
                      : "Overall Risk"}
                  </h2>

                  <p className="text-xs text-slate-500">
                    {selectedState
                      ? "State-specific indicator"
                      : "Dataset-level indicator"}
                  </p>

                </div>

              </div>

              <div className="mt-8 text-center">

                {selectedState && selectedRisk ? (

                  <>
                    <p
                      className={`text-6xl font-bold ${riskColor}`}
                    >
                      {selectedRisk.percentage}%
                    </p>

                    <p
                      className={`mt-2 ${riskColor}`}
                    >
                      {selectedRisk.level} Risk
                    </p>
                  </>

                ) : (

                  <>
                    <p className="text-6xl font-bold text-cyan-400">
                      {loading
                        ? "..."
                        : "READY"}
                    </p>

                    <p className="mt-2 text-slate-400">
                      Search a state
                    </p>
                  </>

                )}

              </div>

              <div className="mt-8 rounded-xl bg-slate-800/50 p-4">

                <p className="text-sm text-slate-400">
                  {selectedState
                    ? "Crime rate"
                    : "Dataset average crime rate"}
                </p>

                <p className="mt-2 text-2xl font-bold">

                  {selectedState
                    ? Number(
                        selectedState.crime_rate
                      ).toFixed(2)
                    : loading
                    ? "..."
                    : averageRate.toFixed(2)}

                </p>

                <p className="mt-1 text-xs text-slate-500">
                  per lakh population
                </p>

              </div>

            </motion.div>

          </div>

          {/* Top States */}

          {!search && (

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl"
            >

              <div className="mb-6">

                <h2 className="text-xl font-semibold">
                  Highest Crime States
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Top states/UTs by total reported IPC cases in 2019
                </p>

              </div>

              <div className="h-96">

                {loading ? (

                  <div className="flex h-full items-center justify-center text-cyan-400">
                    Loading dataset...
                  </div>

                ) : (

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <BarChart
                      data={topStates}
                      margin={{
                        bottom: 40,
                      }}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#1e293b"
                      />

                      <XAxis
                        dataKey="state"
                        stroke="#64748b"
                        angle={-30}
                        textAnchor="end"
                        interval={0}
                      />

                      <YAxis
                        stroke="#64748b"
                      />

                      <Tooltip
                        formatter={(value) =>
                          Number(value).toLocaleString()
                        }
                        contentStyle={{
                          background: "#0f172a",
                          border:
                            "1px solid #1e293b",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />

                      <Legend />

                      <Bar
                        dataKey="2019"
                        name="2019 Cases"
                        fill="#22d3ee"
                        radius={[
                          8,
                          8,
                          0,
                          0,
                        ]}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                )}

              </div>

            </motion.div>

          )}

          {/* State Table */}

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl">

            <div className="mb-5">

              <h2 className="text-xl font-semibold">
                {search
                  ? "Search Results"
                  : "State Crime Data"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? `${filteredData.length} matching state(s)`
                  : "Historical NCRB data used by the intelligence system"}
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>

                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">

                    <th className="px-4 py-3">
                      State / UT
                    </th>

                    <th className="px-4 py-3">
                      2017
                    </th>

                    <th className="px-4 py-3">
                      2018
                    </th>

                    <th className="px-4 py-3">
                      2019
                    </th>

                    <th className="px-4 py-3">
                      Crime Rate
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredData.length === 0 ? (

                    <tr>

                      <td
                        colSpan="5"
                        className="py-10 text-center text-slate-500"
                      >
                        No matching state found.
                      </td>

                    </tr>

                  ) : (

                    filteredData
                      .slice(0, 20)
                      .map((item) => (

                        <tr
                          key={item.state}
                          className="border-b border-white/5 text-sm hover:bg-white/[0.02]"
                        >

                          <td className="px-4 py-3 font-medium">
                            {item.state}
                          </td>

                          <td className="px-4 py-3 text-slate-400">
                            {Number(
                              item["2017"]
                            ).toLocaleString()}
                          </td>

                          <td className="px-4 py-3 text-slate-400">
                            {Number(
                              item["2018"]
                            ).toLocaleString()}
                          </td>

                          <td className="px-4 py-3 text-slate-400">
                            {Number(
                              item["2019"]
                            ).toLocaleString()}
                          </td>

                          <td className="px-4 py-3 font-semibold text-cyan-400">
                            {Number(
                              item.crime_rate
                            ).toFixed(2)}
                          </td>

                        </tr>

                      ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl transition-all hover:border-cyan-400/20"
    >

      <div className="flex items-center justify-between">

        <div className="rounded-xl bg-cyan-400/10 p-3">

          <Icon
            className="text-cyan-400"
            size={21}
          />

        </div>

        <span className="text-xs font-semibold text-green-400">
          {change}
        </span>

      </div>

      <p className="mt-5 text-sm text-slate-400">
        {title}
      </p>

      <h2 className="mt-1 text-3xl font-bold">
        {value}
      </h2>

    </motion.div>
  );
}

function StateStat({
  title,
  value,
  highlight = false,
}) {
  return (
    <div
      className={`rounded-xl p-4 ${
        highlight
          ? "bg-cyan-500/10"
          : "bg-slate-800/50"
      }`}
    >

      <p className="text-xs text-slate-500">
        {title}
      </p>

      <p
        className={`mt-2 text-xl font-bold ${
          highlight
            ? "text-cyan-400"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}