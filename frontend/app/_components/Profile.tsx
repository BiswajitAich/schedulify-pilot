"use client";
import styles from "@/app/styles/Profile.module.css";

import Image from "next/image";
import { useUserContext } from "../_utils/user-contextProvider";
import Link from "next/link";

const Profile = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
  const userData = useUserContext();

  return (
    <div className={styles.mainContainer}>
      <Link href={"profile"} className={styles.container}>
        {userData?.profile_photo ? (
          <Image src={""} height={40} width={40} alt="profile" loading="lazy" />
        ) : (
          <p className={styles.photo}>{userData?.firstname.charAt(0)}</p>
        )}

        {sidebarOpen ? (
          <p className={styles.name}>
            {userData?.firstname + " " + userData?.lastname}
          </p>
        ) : null}
      </Link>
    </div>
  );
};

export default Profile;
