import { useEffect, useState } from "react";
import { fetchReportedCalls, toggleOffender } from "../../services/adminApi";

/* ================= HELPERS ================= */
const formatDate = (date?: string) =>
  date ? new Date(date).toLocaleString() : "-";

const formatDuration = (start?: string, end?: string) => {
  if (!start || !end) return "-";
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${mins}m ${secs}s`;
};
/* ========================================== */

const ReportedCalls = () => {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  /* ===== FETCH REPORTED CALLS ===== */
  useEffect(() => {
    fetchReportedCalls()
      .then(res => setCalls(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ===== BLOCK / UNBLOCK ===== */
  const handleToggle = async (callId: string) => {
    if (!confirm("Block / Unblock offender for this call?")) return;

    try {
      setActionId(callId);

      const res = await toggleOffender(callId);

      setCalls(prev =>
        prev.map(call =>
          call._id === callId
            ? { ...call, offenderBlocked: res.data.isBlocked }
            : call
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update offender status");
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return <p className="p-6 text-white">Loading...</p>;
  }

  if (!calls.length) {
    return <p className="p-6 text-white">No reported calls</p>;
  }

  return (
    <div className="p-6 space-y-6 text-white">
      <h1 className="text-2xl font-bold">Reported Calls</h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-900 rounded text-sm">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3">Caller</th>
              <th className="p-3">Receiver</th>
              <th className="p-3">Language</th>
              <th className="p-3">Started</th>
              <th className="p-3">Ended</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Reported By</th>
              <th className="p-3">Reported At</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {calls.map(call => {

              // ✅ FIXED LOGIC (handles populated + non-populated)
              const reportedByCaller =
                String(call.reportedBy?._id || call.reportedBy) ===
                String(call.caller?._id);

              return (
                <tr
                  key={call._id}
                  className="border-t border-gray-800 align-top"
                >
                  {/* CALLER */}
                  <td className="p-3">
                    <p className="font-semibold">{call.caller?.name}</p>
                    <p className="text-xs text-gray-400">
                      {call.caller?.email}
                    </p>
                  </td>

                  {/* RECEIVER */}
                  <td className="p-3">
                    <p className="font-semibold">
                      {call.receiver?.name || "—"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {call.receiver?.email || ""}
                    </p>
                  </td>

                  {/* LANGUAGE */}
                  <td className="p-3">{call.language}</td>

                  {/* START */}
                  <td className="p-3">
                    {formatDate(call.startedAt)}
                  </td>

                  {/* END */}
                  <td className="p-3">
                    {formatDate(call.endedAt)}
                  </td>

                  {/* DURATION */}
                  <td className="p-3 font-medium text-blue-400">
                    {formatDuration(call.startedAt, call.endedAt)}
                  </td>

                  {/* REASON */}
                  <td className="p-3 max-w-xs">
                    {call.reportReason}
                  </td>

                  {/* REPORTED BY */}
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        reportedByCaller
                          ? "bg-blue-600"
                          : "bg-purple-600"
                      }`}
                    >
                      {reportedByCaller ? "Caller" : "Receiver"}
                    </span>
                  </td>

                  {/* REPORTED AT */}
                  <td className="p-3">
                    {formatDate(call.reportedAt)}
                  </td>

                  {/* ACTION */}
                  <td className="p-3">
                    <button
                      onClick={() => handleToggle(call._id)}
                      disabled={actionId === call._id}
                      className={`px-3 py-1 rounded font-medium transition
                        ${
                          call.offenderBlocked
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        } disabled:opacity-50`}
                    >
                      {actionId === call._id
                        ? "Processing..."
                        : call.offenderBlocked
                        ? "Unblock"
                        : "Block"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportedCalls;

// import { useEffect, useState } from "react";
// import { fetchReportedCalls, toggleOffender } from "../../services/adminApi";

// /* ================= HELPERS ================= */

// // ✅ FIXED DATE FORMAT
// const formatDate = (date?: string) => {
//   if (!date) return "-";
//   const d = new Date(date);
//   return isNaN(d.getTime()) ? "-" : d.toLocaleString();
// };

// // ✅ FIXED DURATION (safe)
// const formatDuration = (start?: string, end?: string) => {
//   if (!start || !end) return "-";

//   const startTime = new Date(start).getTime();
//   const endTime = new Date(end).getTime();

//   if (isNaN(startTime) || isNaN(endTime) || endTime <= startTime) return "-";

//   const diff = endTime - startTime;

//   const mins = Math.floor(diff / 60000);
//   const secs = Math.floor((diff % 60000) / 1000);

//   return `${mins}m ${secs}s`;
// };

// /* ========================================== */

// const ReportedCalls = () => {
//   const [calls, setCalls] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionId, setActionId] = useState<string | null>(null);

//   /* ===== FETCH REPORTED CALLS ===== */
//   useEffect(() => {
//     fetchReportedCalls()
//       .then((res) => setCalls(res.data))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   /* ===== BLOCK / UNBLOCK ===== */
//   const handleToggle = async (callId: string) => {
//     if (!confirm("Block / Unblock offender for this call?")) return;

//     try {
//       setActionId(callId);

//       const res = await toggleOffender(callId);

//       setCalls((prev) =>
//         prev.map((call) =>
//           call._id === callId
//             ? { ...call, offenderBlocked: res.data.isBlocked }
//             : call
//         )
//       );
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update offender status");
//     } finally {
//       setActionId(null);
//     }
//   };

//   if (loading) {
//     return <p className="p-6 text-white">Loading...</p>;
//   }

//   if (!calls.length) {
//     return <p className="p-6 text-white">No reported calls</p>;
//   }

//   return (
//     <div className="p-6 space-y-6 text-white">
//       <h1 className="text-2xl font-bold">Reported Calls</h1>

//       <div className="overflow-x-auto">
//         <table className="w-full bg-gray-900 rounded text-sm">
//           <thead className="bg-gray-800">
//             <tr>
//               <th className="p-3">Caller</th>
//               <th className="p-3">Receiver</th>
//               <th className="p-3">Language</th>
//               <th className="p-3">Started</th>
//               <th className="p-3">Ended</th>
//               <th className="p-3">Duration</th>
//               <th className="p-3">Reason</th>
//               <th className="p-3">Reported By</th>
//               <th className="p-3">Reported At</th>
//               <th className="p-3">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {calls.map((call) => {
//               // ✅ FIX: Correct comparison using String()
//               const reportedByCaller =
//                 String(call.reportedBy) === String(call.caller?._id);

//               // ✅ FIX: Identify offender correctly
//               const offender = reportedByCaller
//                 ? call.receiver
//                 : call.caller;

//               return (
//                 <tr
//                   key={call._id}
//                   className="border-t border-gray-800 align-top"
//                 >
//                   {/* CALLER */}
//                   <td className="p-3">
//                     <p className="font-semibold">{call.caller?.name}</p>
//                     <p className="text-xs text-gray-400">
//                       {call.caller?.email}
//                     </p>
//                   </td>

//                   {/* RECEIVER */}
//                   <td className="p-3">
//                     <p className="font-semibold">{call.receiver?.name}</p>
//                     <p className="text-xs text-gray-400">
//                       {call.receiver?.email}
//                     </p>
//                   </td>

//                   {/* LANGUAGE */}
//                   <td className="p-3">{call.language}</td>

//                   {/* START */}
//                   <td className="p-3">
//                     {formatDate(call.startedAt)}
//                   </td>

//                   {/* END */}
//                   <td className="p-3">
//                     {formatDate(call.endedAt)}
//                   </td>

//                   {/* DURATION */}
//                   <td className="p-3 font-medium text-blue-400">
//                     {formatDuration(call.startedAt, call.endedAt)}
//                   </td>

//                   {/* REASON */}
//                   <td className="p-3 max-w-xs">
//                     {call.reportReason}
//                   </td>

//                   {/* REPORTED BY */}
//                   <td className="p-3 text-center">
//                     <span
//                       className={`px-2 py-1 rounded text-xs ${
//                         reportedByCaller
//                           ? "bg-blue-600"
//                           : "bg-purple-600"
//                       }`}
//                     >
//                       {reportedByCaller ? "Caller" : "Receiver"}
//                     </span>
//                   </td>

//                   {/* REPORTED AT */}
//                   <td className="p-3">
//                     {formatDate(call.reportedAt)}
//                   </td>

//                   {/* ACTION */}
//                   <td className="p-3">
//                     <div className="text-xs mb-1 text-gray-400">
//                       Offender: {offender?.name || "Unknown"}
//                     </div>

//                     <button
//                       onClick={() => handleToggle(call._id)}
//                       disabled={actionId === call._id}
//                       className={`px-3 py-1 rounded font-medium transition
//                         ${
//                           call.offenderBlocked
//                             ? "bg-green-600 hover:bg-green-700"
//                             : "bg-red-600 hover:bg-red-700"
//                         } disabled:opacity-50`}
//                     >
//                       {actionId === call._id
//                         ? "Processing..."
//                         : call.offenderBlocked
//                         ? "Unblock"
//                         : "Block"}
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ReportedCalls;