import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchAnalytics } from "../../services/adminApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const COLORS = ["#ef4444", "#22c55e", "#eab308", "#38bdf8", "#a855f7"];

interface CallSession {
  language?: string;
  reportReason?: string;
  reportedAt?: string;
  feedbacks?: any[];
}

const Analytics = () => {
  const [calls, setCalls] = useState<CallSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics()
      .then((res) => {
        setCalls(res.data?.reportedCalls || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6 text-white">Loading analytics...</p>;
  }

  if (!calls.length) {
    return <p className="p-6 text-white">No analytics data found</p>;
  }

  /* =====================================================
     1️⃣ DATE + REASON → STACKED BAR (MOST IMPORTANT)
  ===================================================== */
  const dateReasonMap: any = {};

  calls.forEach((c) => {
    if (!c.reportedAt) return;
    const date = new Date(c.reportedAt).toLocaleDateString();
    const reason = c.reportReason || "Unknown";

    dateReasonMap[date] ??= { date };
    dateReasonMap[date][reason] =
      (dateReasonMap[date][reason] || 0) + 1;
  });

  const stackedData = Object.values(dateReasonMap);

  const allReasons = Array.from(
    new Set(calls.map((c) => c.reportReason || "Unknown"))
  );

  /* =====================================================
     2️⃣ TOP REPORT REASONS (RANKING)
  ===================================================== */
  const reasonRanking = Object.values(
    calls.reduce((acc: any, c) => {
      const r = c.reportReason || "Unknown";
      acc[r] ??= { reason: r, count: 0 };
      acc[r].count++;
      return acc;
    }, {})
  ).sort((a: any, b: any) => b.count - a.count);

  /* =====================================================
     3️⃣ LANGUAGE DISTRIBUTION
  ===================================================== */
    const languageData: { name: string; value: number }[] = Object.values(
    calls.reduce((acc: Record<string, { name: string; value: number }>, c) => {
      const lang = c.language || "Unknown";
      acc[lang] ??= { name: lang, value: 0 };
      acc[lang].value++;
      return acc;
    }, {})
  );

  /* =====================================================
     4️⃣ EXCEL EXPORT
  ===================================================== */
  const exportExcel = () => {
    const rows = calls.map((c) => ({
      Language: c.language || "Unknown",
      Reason: c.reportReason || "Unknown",
      Date: c.reportedAt
        ? new Date(c.reportedAt).toLocaleString()
        : "",
      HasFeedback:
        Array.isArray(c.feedbacks) && c.feedbacks.length > 0
          ? "Yes"
          : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "reported-calls-analytics.xlsx");
  };

  return (
    <div className="p-6 space-y-24 text-white">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics & Reports</h1>
        <button
          onClick={exportExcel}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Download Excel
        </button>
      </div>

      {/* ================= STACKED BAR ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Report Trends by Date & Reason
        </h2>

        <BarChart
          width={1000}
          height={400}
          data={stackedData}
          margin={{ left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />

          {allReasons.map((reason, i) => (
            <Bar
              key={reason}
              dataKey={reason}
              stackId="a"
              fill={COLORS[i % COLORS.length]}
            />
          ))}
        </BarChart>

        <p className="text-sm text-gray-400 mt-2">
          ✔ Each bar = one date | ✔ Colors = report reasons | ✔ Height = volume
        </p>
      </section>

      {/* ================= TOP REASONS ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Most Reported Reasons
        </h2>

        <BarChart
          width={800}
          height={400}
          data={reasonRanking}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="reason" type="category" />
          <Tooltip />
          <Bar dataKey="count" fill="#ef4444" />
        </BarChart>
      </section>

      {/* ================= LANGUAGE PIE ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Reports by Language
        </h2>

        <PieChart width={500} height={320}>
          <Pie
            data={languageData}
            dataKey="value"
            outerRadius={120}
            label
          >
            {languageData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </section>
    </div>
  );
};

export default Analytics;






















// In src/admin/pages/Analytics.tsx, replace lines 83–90 with:

//  const languageData = Object.values(
//     calls.reduce((acc: any, c) => {
//       const lang = c.language || "Unknown";
//       acc[lang] ??= { name: lang, value: 0 };
//       acc[lang].value++;
//       return acc;
//     }, {})
//   );