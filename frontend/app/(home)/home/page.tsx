"use client";
import { useEffect, useState } from "react";
import styles from "@/app/(home)/home/HomePage.module.css";
import DashBoard from "../../_components/Dashboard";
import Link from "next/link";
import { useUserContext } from "../../_utils/user-contextProvider";
const Home = () => {
  const [date, setDate] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const userData = useUserContext();
  useEffect(() => {
    const d = new Date();
    setDate(`${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`);
  }, []);
  return (
    <div className={styles.dashBoardElements}>
      <div className={styles.p1}>
        Dashboard <span>{date}</span>
        {userData.role === "admin" ? (
          <div className={styles.addContainer}>
            <button onClick={() => setShow(!show)} className={styles.add}>
              {!show ? "+" : "X"}
            </button>
            {show ? (
              <div className={styles.addLinks}>
                <Link href={"/add-employee"} className={styles.addEmployee}>
                  + add Employee
                </Link>
                <Link href={"/add-shifts"} className={styles.addShifts}>
                  + add shifts
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <DashBoard />
    </div>
  );
};

export default Home;
