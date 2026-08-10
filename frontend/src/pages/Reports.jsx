import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  FileText,
  Search,
  Shield,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

const API = "http://127.0.0.1:8000";

export default function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [reportsData, setReportsData] = useState([]);
  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("All");
  const [status, setStatus] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/reports`);

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();

      setReportsData(
        Array.isArray(data.reports)
          ? data.reports
          : []
      );
    } catch (err) {
      console.error("Reports error:", err);

      setError(
        "Unable to connect to the crime reports backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reportsData.filter((report) => {
      const searchableText = [
        report.report_id,
        report.city,
        report.location,
        report.type,
        report.crime_type,
        report.date,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const reportRisk =
        String(report.risk || "").toLowerCase();

      const selectedRisk =
        risk.toLowerCase();

      const matchesRisk =
        risk === "All" ||
        reportRisk === selectedRisk;

      const matchesStatus =
        status === "All" ||
        String(report.status || "").toLowerCase() ===
          status.toLowerCase();

      return (
        matchesSearch &&
        matchesRisk &&
        matchesStatus
      );
    });
  }, [
    reportsData,
    search,
    risk,
    status,
  ]);

  const totalReports = reportsData.length;

  const highRisk = reportsData.filter(
    (report) =>
      String(report.risk || "").toLowerCase() ===
      "high"
  ).length;

  const investigating = reportsData.filter(
    (report) =>
      String(report.status || "").toLowerCase() ===
      "investigating"
  ).length;

  const resolved = reportsData.filter(
    (report) =>
      String(report.status || "").toLowerCase() ===
      "resolved"
  ).length;

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
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="text-xs font-semibold tracking-[0.25em] text-cyan-400">
                CRIME DATABASE
              </p>

              <h1 className="mt-2 text-3xl font-bold lg:text-4xl">
                Crime Reports
              </h1>

              <p className="mt-2 text-slate-400">
                Search, filter and monitor reported incidents.
              </p>

            </div>

            <button
              onClick={loadReports}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>

          {/* Summary */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <SummaryCard
              title="Total Reports"
              value={totalReports}
              icon={
                <FileText className="text-cyan-400" />
              }
            />

            <SummaryCard
              title="High Risk"
              value={highRisk}
              icon={
                <AlertTriangle className="text-red-400" />
              }
            />

            <SummaryCard
              title="Investigating"
              value={investigating}
              icon={
                <Search className="text-yellow-400" />
              }
            />

            <SummaryCard
              title="Resolved"
              value={resolved}
              icon={
                <Shield className="text-green-400" />
              }
            />

          </div>

          {/* Filters */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl">

            <div className="flex items-center gap-2 text-slate-300">

              <SlidersHorizontal size={18} />

              <span className="font-semibold">
                Report Filters
              </span>

            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">

              {/* Search */}
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
                  placeholder="Search city, crime or report ID..."
                  className="w-full rounded-xl border border-white/10 bg-slate-800/70 py-3.5 pl-11 pr-4 text-white outline-none focus:border-cyan-400/40"
                />

              </div>

              {/* Risk */}
              <select
                value={risk}
                onChange={(e) =>
                  setRisk(e.target.value)
                }
                className="rounded-xl border border-white/10 bg-slate-800/70 px-4 py-3.5 text-white outline-none focus:border-cyan-400/40"
              >

                <option value="All">
                  All Risk Levels
                </option>

                <option value="High">
                  High Risk
                </option>

                <option value="Medium">
                  Medium Risk
                </option>

                <option value="Low">
                  Low Risk
                </option>

              </select>

              {/* Status */}
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="rounded-xl border border-white/10 bg-slate-800/70 px-4 py-3.5 text-white outline-none focus:border-cyan-400/40"
              >

                <option value="All">
                  All Status
                </option>

                <option value="Open">
                  Open
                </option>

                <option value="Investigating">
                  Investigating
                </option>

                <option value="Resolved">
                  Resolved
                </option>

              </select>

            </div>

          </div>

          {/* Error */}
          {error && (

            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">

              <AlertTriangle
                className="mx-auto text-red-400"
                size={35}
              />

              <p className="mt-3 font-semibold text-red-400">
                Failed to load reports
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {error}
              </p>

              <button
                onClick={loadReports}
                className="mt-5 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"
              >
                Try Again
              </button>

            </div>
          )}

          {/* Loading */}
          {loading && !error && (

            <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-10 text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />

              <p className="mt-4 text-sm text-cyan-400">
                Loading crime reports...
              </p>

            </div>

          )}

          {/* Reports */}
          {!loading && !error && (

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl">

              <div className="flex items-center justify-between border-b border-white/10 bg-slate-800/30 p-5">

                <div>

                  <p className="text-sm font-semibold">
                    {filteredReports.length} matching reports
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Showing live data from MongoDB
                  </p>

                </div>

                <FileText
                  size={20}
                  className="text-cyan-400"
                />

              </div>

              {/* Desktop Header */}
              <div className="hidden grid-cols-6 border-b border-white/10 p-5 text-xs font-semibold uppercase tracking-wider text-slate-500 md:grid">

                <span>Report ID</span>
                <span>Location</span>
                <span>Crime Type</span>
                <span>Risk</span>
                <span>Status</span>
                <span>Date</span>

              </div>

              {filteredReports.length === 0 ? (

                <div className="flex min-h-60 flex-col items-center justify-center text-center">

                  <Search
                    className="text-slate-600"
                    size={40}
                  />

                  <p className="mt-4 font-semibold">
                    No reports found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or filters.
                  </p>

                </div>

              ) : (

                filteredReports.map(
                  (report, index) => (

                    <motion.div
                      key={
                        report.report_id ||
                        report._id ||
                        index
                      }
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.03,
                      }}
                      className="grid gap-4 border-b border-white/5 p-5 transition hover:bg-white/[0.02] md:grid-cols-6 md:items-center"
                    >

                      {/* ID */}
                      <div>

                        <p className="text-xs text-slate-500 md:hidden">
                          Report ID
                        </p>

                        <p className="font-semibold text-cyan-400">
                          {report.report_id ||
                            "N/A"}
                        </p>

                      </div>

                      {/* Location */}
                      <div>

                        <p className="text-xs text-slate-500 md:hidden">
                          Location
                        </p>

                        <p>
                          {report.city ||
                            report.location ||
                            "Unknown"}
                        </p>

                      </div>

                      {/* Type */}
                      <div>

                        <p className="text-xs text-slate-500 md:hidden">
                          Crime Type
                        </p>

                        <div className="flex items-center gap-2">

                          <FileText
                            size={16}
                            className="text-slate-500"
                          />

                          {report.type ||
                            report.crime_type ||
                            "Unknown"}

                        </div>

                      </div>

                      {/* Risk */}
                      <div>

                        <p className="text-xs text-slate-500 md:hidden">
                          Risk
                        </p>

                        <RiskBadge
                          risk={
                            report.risk ||
                            "Unknown"
                          }
                        />

                      </div>

                      {/* Status */}
                      <div>

                        <p className="text-xs text-slate-500 md:hidden">
                          Status
                        </p>

                        <StatusBadge
                          status={
                            report.status ||
                            "Unknown"
                          }
                        />

                      </div>

                      {/* Date */}
                      <div>

                        <p className="text-xs text-slate-500 md:hidden">
                          Date
                        </p>

                        <div className="flex items-center gap-2 text-sm text-slate-400">

                          <Calendar size={15} />

                          {report.date ||
                            "Date unavailable"}

                        </div>

                      </div>

                    </motion.div>

                  )
                )

              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}


function SummaryCard({
  title,
  value,
  icon,
}) {

  return (

    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl transition-all hover:border-cyan-400/20"
    >

      <div className="flex items-center justify-between">

        <div className="rounded-xl bg-white/5 p-3">
          {icon}
        </div>

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


function RiskBadge({ risk }) {

  const normalized =
    String(risk).toLowerCase();

  const styles = {
    high:
      "bg-red-500/10 text-red-400 border-red-500/20",

    medium:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    low:
      "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (

    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
        styles[normalized] ||
        "bg-slate-500/10 text-slate-400 border-slate-500/20"
      }`}
    >
      {risk}
    </span>

  );
}


function StatusBadge({ status }) {

  const normalized =
    String(status).toLowerCase();

  const styles = {
    open:
      "bg-red-500/10 text-red-400",

    investigating:
      "bg-yellow-500/10 text-yellow-400",

    resolved:
      "bg-green-500/10 text-green-400",
  };

  return (

    <span
      className={`text-sm font-medium ${
        styles[normalized] ||
        "text-slate-400"
      }`}
    >
      {status}
    </span>

  );
}