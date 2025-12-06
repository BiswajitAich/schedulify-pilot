"use client";

import { useEffect, useState } from "react";
import styles from "@/app/styles/DashBoard.module.css";
import { AdminShift } from "../types";

const AdminShifts = () => {
  const [shifts, setShifts] = useState<AdminShift[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/getAllShifts");
      const data = await res.json();
      if (!data.success) {
        setMsg(data.message || "Failed to load");
        setShifts([]);
      } else {
        setShifts(data.data || []);
      }
    } catch (e) {
      console.log(e);
      setMsg("Error fetching shifts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  return (
    <div className={styles.container}>
      <h2 style={{ marginBottom: 12 }}>All Shifts</h2>

      {loading && <p>Loading shifts...</p>}
      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Created By</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {shifts.length === 0 && !loading && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No shifts found
                </td>
              </tr>
            )}

            {shifts.map((s) => (
              <tr key={s.id}>
                <td>
                  {s.employee_code} — {s.employee_name}
                </td>
                <td>{new Date(s.date).toLocaleDateString()}</td>
                <td>{s.start_time}</td>
                <td>{s.end_time}</td>
                <td>
                  {s.created_by_code
                    ? `${s.created_by_code} — ${s.created_by_name}`
                    : "System"}
                </td>
                <td>
                  {s.created_at ? new Date(s.created_at).toLocaleString() : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminShifts;
