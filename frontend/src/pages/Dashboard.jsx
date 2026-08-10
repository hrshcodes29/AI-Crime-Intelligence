import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Brain,
  FileText,
  Map,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import CrimeMap from "../components/CrimeMap";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

const API = "http://127.0.0.1:8000";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({
    total_reports: 0,
    high_risk: 0,
    investigating: 0,
    resolved: 0,
  });

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsResponse, reportsResponse] = await Promise.all([
          fetch(`${API}/dashboard-stats`),
          fetch(`${API}/reports`),
        ]);

        if (!statsResponse.ok || !reportsResponse.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const statsData = await statsResponse.json();
        const reportsData = await reportsResponse.json();

        setDashboardStats({
          total_reports: Number(statsData.total_reports || 0),
          high_risk: Number(statsData.high_risk || 0),
          investigating: Number(statsData.investigating || 0),
          resolved: Number(statsData.resolved || 0),
        });

        setIncidents(reportsData.reports || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(
          "Unable to connect to the crime intelligence backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Total Crime Reports",
      value: dashboardStats.total_reports,
      change: "Database",
      icon: FileText,
    },
    {
      title: "High Risk Reports",
      value: dashboardStats.high_risk,
      change: "Current",
      icon: AlertTriangle,
    },
    {
      title: "Investigating Reports",
      value: dashboardStats.investigating,
      change: "Active",
      icon: Users,
    },
    {
      title: "Resolved Reports",
      value: dashboardStats.resolved,
      change: "Completed",
      icon: Brain,
    },
  ];

  const riskPercentage = useMemo(() => {
    if (!dashboardStats.total_reports) return 0;

    return Math.round(
      (dashboardStats.high_risk /
        dashboardStats.total_reports) *
        100
    );
  }, [dashboardStats]);

  const riskLevel =
    riskPercentage >= 60
      ? "HIGH"
      : riskPercentage >= 30
      ? "MODERATE"
      : "LOW";

  const riskColor =
    riskLevel === "HIGH"
      ? "text-red-400"
      : riskLevel === "MODERATE"
      ? "text-yellow-400"
      : "text-green-400";

  const riskBorder =
    riskLevel === "HIGH"
      ? "border-red-400"
      : riskLevel === "MODERATE"
      ? "border-yellow-400"
      : "border-green-400";

  const trendData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const counts = {};

    incidents.forEach((incident) => {
      if (!incident.date) return;

      const date = new Date(incident.date);

      if (Number.isNaN(date.getTime())) return;

      const monthIndex = date.getMonth();

      counts[monthIndex] =
        (counts[monthIndex] || 0) + 1;
    });

    return months.map((month, index) => ({
      month,
      reports: counts[index] || 0,
    }));
  }, [incidents]);

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
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>
              <p className="text-sm text-slate-500">
                Welcome back, Officer
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight lg:text-4xl">
                Crime Intelligence Overview
              </h1>

              <p className="mt-2 text-slate-400">
                Monitor threats, analyze incidents and review AI predictions.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              <Activity size={16} />
              Backend Connected
            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl transition-all hover:border-cyan-400/20"
                >

                  <div className="flex items-center justify-between">

                    <div className="rounded-xl bg-cyan-400/10 p-3">
                      <Icon
                        className="text-cyan-400"
                        size={22}
                      />
                    </div>

                    <span className="text-xs font-semibold text-green-400">
                      {stat.change}
                    </span>

                  </div>

                  <p className="mt-5 text-sm text-slate-400">
                    {stat.title}
                  </p>

                  <h3 className="mt-1 text-3xl font-bold">
                    {loading
                      ? "..."
                      : stat.value.toLocaleString()}
                  </h3>

                </motion.div>
              );
            })}

          </div>

          {/* Map + AI */}
          <div className="mt-6 grid gap-6 xl:grid-cols-3">

            {/* Crime Map */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl xl:col-span-2">

              <div className="flex items-center justify-between">

                <div>

                  <div className="flex items-center gap-2">
                    <Map
                      className="text-cyan-400"
                      size={20}
                    />

                    <h2 className="font-semibold">
                      Crime Monitor
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Geographic crime intelligence
                  </p>

                </div>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                  LIVE
                </span>

              </div>

              <div className="mt-5 overflow-hidden rounded-xl">
                <CrimeMap />
              </div>

            </div>

            {/* AI Risk */}
            <div className="rounded-2xl border border-purple-500/20 bg-slate-900/70 p-6 backdrop-blur-xl">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-purple-500/10 p-3">
                  <Brain className="text-purple-400" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    AI Risk Engine
                  </h2>

                  <p className="text-xs text-slate-500">
                    Database risk overview
                  </p>
                </div>

              </div>

              <div className="mt-8 flex justify-center">

                <div
                  className={`relative flex h-44 w-44 items-center justify-center rounded-full border-[10px] ${riskBorder}/20`}
                >

                  <div
                    className={`absolute inset-0 rounded-full border-[10px] border-transparent border-t-current border-r-current ${riskColor}`}
                  />

                  <div className="text-center">

                    <p className="text-4xl font-bold">
                      {loading ? "..." : `${riskPercentage}%`}
                    </p>

                    <p className={`mt-1 text-sm ${riskColor}`}>
                      {loading ? "ANALYZING" : riskLevel}
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-7 rounded-xl bg-yellow-400/5 p-4">

                <div className="flex gap-3">

                  <AlertTriangle
                    className={`shrink-0 ${riskColor}`}
                    size={19}
                  />

                  <div>

                    <p className="text-sm font-semibold">
                      {loading
                        ? "Analyzing database..."
                        : `${riskLevel} Threat Level`}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {loading
                        ? "Calculating the current report risk."
                        : `${dashboardStats.high_risk} of ${dashboardStats.total_reports} reports are currently marked as high risk.`}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Crime Trend */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>

                <div className="flex items-center gap-2">

                  <Activity
                    className="text-cyan-400"
                    size={20}
                  />

                  <h2 className="text-xl font-semibold">
                    Crime Activity Trend
                  </h2>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Reports grouped by month from the database
                </p>

              </div>

              <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-400">
                DATABASE REPORTS
              </div>

            </div>

            <div className="mt-6 h-80">

              {incidents.length === 0 ? (

                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  No dated reports available for the trend.
                </div>

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <AreaChart data={trendData}>

                    <defs>

                      <linearGradient
                        id="dashboardCrimeGradient"
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
                      dataKey="month"
                      stroke="#64748b"
                      tickLine={false}
                    />

                    <YAxis
                      stroke="#64748b"
                      tickLine={false}
                      allowDecimals={false}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "12px",
                        color: "#ffffff",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="reports"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      fill="url(#dashboardCrimeGradient)"
                    />

                  </AreaChart>

                </ResponsiveContainer>

              )}

            </div>

          </div>

          {/* Recent Incidents */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  Recent Incidents
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest crime intelligence reports
                </p>

              </div>

              <NavLink
                to="/reports"
                className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
              >
                View All →
              </NavLink>

            </div>

            <div className="mt-6 space-y-3">

              {loading ? (

                <div className="py-8 text-center text-sm text-cyan-400">
                  Loading latest incidents...
                </div>

              ) : incidents.length === 0 ? (

                <div className="py-8 text-center text-sm text-slate-500">
                  No crime reports available.
                </div>

              ) : (

                incidents.slice(0, 5).map((incident, index) => (

                  <div
                    key={
                      incident.report_id ||
                      incident._id ||
                      index
                    }
                    className="flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-800/40 p-4 transition hover:border-cyan-400/10 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>

                      <p className="font-medium">
                        {incident.type ||
                          incident.crime_type ||
                          "Crime Report"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {incident.city ||
                          incident.location ||
                          "Unknown location"}
                        {" • "}
                        {incident.date || "Date unavailable"}
                      </p>

                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                        incident.risk === "High"
                          ? "bg-red-500/10 text-red-400"
                          : incident.risk === "Medium"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {incident.risk || "Unknown"}
                    </span>

                  </div>

                ))

              )}

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}