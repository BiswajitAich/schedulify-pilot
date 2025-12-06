"use client";
import { useState } from "react";
import styles from "@/app/styles/Sidebar.module.css";
import Image from "next/image";
import Profile from "./Profile";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  return (
    <aside
      className={`${styles.sidebar} ${
        sidebarOpen ? styles.open : styles.close
      }`}
    >
      {sidebarOpen ? <p className={styles.p1}>employee shift</p> : null}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={styles.toggle}
      >
        <Image src={"./sidebar-left.svg"} height={40} width={40} alt="" />
      </button>
      <div>Menu items here</div>
      <Profile sidebarOpen={sidebarOpen}/>
    </aside>
  );
};

export default Sidebar;
