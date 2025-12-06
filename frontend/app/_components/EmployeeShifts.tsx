"use client";

import { useEffect, useState } from "react";
import styles from "@/app/styles/DashBoard.module.css";
import { Shift } from "../types";

const EmployeeShifts = ({ employeeId }: { employeeId: string }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchMyShifts = async () => {
    if (!employeeId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/getMyShifts?id=${employeeId}`);
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
    fetchMyShifts();
  }, [employeeId]);

  return (
    <div className={styles.sectionContainer}>
      <h2 className={styles.sectionTitle}>Your Shifts</h2>
      
      {loading && <p className={styles.loadingText}>Loading shifts...</p>}
      {msg && <p className={styles.errorText}>{msg}</p>}

      <div className={styles.shiftsGrid}>
        {shifts.length === 0 && !loading && (
          <div className={styles.emptyState}>No shifts scheduled</div>
        )}
        
        {shifts.map((s) => (
          <div key={s.id} className={styles.shiftCard}>
            <div className={styles.shiftDate}>
              {new Date(s.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className={styles.shiftTime}>
              {s.start_time} — {s.end_time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeShifts;