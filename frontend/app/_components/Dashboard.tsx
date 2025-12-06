import styles from "@/app/styles/DashBoard.module.css";
import EmployeeShifts from "./EmployeeShifts";
import AdminShifts from "./AdminShifts";
import { useUserContext } from "../_utils/user-contextProvider";
import { useEffect, useState } from "react";

type ExtraInfo = {
  totalEmployee: number;
  totalShifts: number;
  upcomingShift_date: string | null;
  upcomingShift_startTime: string | null;
  upcomingShift_endTime: string | null;
};

const DashBoard = () => {
  const userData = useUserContext();
  const [extraInfo, setExtraInfo] = useState<ExtraInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getExtraInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/getExtraInfo");
      if (!res.ok) {
        setExtraInfo(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setExtraInfo(data);
    } catch (error) {
      console.log("Error fetching extra info:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getExtraInfo();
  }, []);

  return (
    <div className={styles.dashboardWrapper}>
      {loading ? (
        <div className={styles.loadingState}>
          <p>Loading dashboard...</p>
        </div>
      ) : extraInfo ? (
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{extraInfo.totalEmployee}</p>
            <p className={styles.statLabel}>Total Employees</p>
          </div>

          <div className={styles.statCard}>
            <p className={styles.statValue}>{extraInfo.totalShifts}</p>
            <p className={styles.statLabel}>Today's Shifts</p>
          </div>

          {extraInfo.upcomingShift_date && (
            <div className={styles.statCard}>
              <p className={styles.statValue}>
                {new Date(extraInfo.upcomingShift_date).toLocaleDateString()}
              </p>
              <p className={styles.statTime}>
                {extraInfo.upcomingShift_startTime} –{" "}
                {extraInfo.upcomingShift_endTime}
              </p>
              <p className={styles.statLabel}>Next Upcoming Shift</p>
            </div>
          )}
        </div>
      ) : null}

      {userData.role === "admin" ? (
        <AdminShifts />
      ) : (
        <EmployeeShifts employeeId={userData.id} />
      )}
    </div>
  );
};

export default DashBoard;