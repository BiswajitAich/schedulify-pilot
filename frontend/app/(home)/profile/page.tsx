"use client";
import styles from "./Profile.module.css";
import { UserData } from "@/app/types";
import { useUserContext } from "@/app/_utils/user-contextProvider";
import Image from "next/image";
import { resetCookie } from "@/app/_utils/cookie";

const Profile = () => {
  const userData: UserData = useUserContext();
  const defaultProfilePhoto = `https://ui-avatars.com/api/?name=${userData?.firstname}+${userData?.lastname}&size=200&background=3accff&color=fff&bold=true&format=png`;

  const deleteUser = async () => {
    const res = await fetch("/api/deleteUser", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userData.id }),
    });

    const data = await res.json();
    alert(data.message);
    if (data.success) resetCookie();
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        {/* Banner Image */}
        <div className={styles.bannerContainer}>
          <Image
            src={userData?.profile_banner || "/defaultBanner.gif"}
            alt="Profile Banner"
            className={styles.bannerImage}
            fill={true}
            loading="eager"
          />
        </div>

        {/* Profile Photo */}
        <div className={styles.profilePhotoContainer}>
          <Image
            src={userData?.profile_photo || defaultProfilePhoto}
            alt="Profile Photo"
            className={styles.profilePhoto}
            width={100}
            height={100}
            loading="lazy"
          />
        </div>

        {/* Profile Information */}
        <div className={styles.profileInfo}>
          <h1 className={styles.name}>
            {userData?.firstname} {userData?.lastname}
          </h1>

          <div className={styles.detailsContainer}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{userData?.email}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Role:</span>
              <span
                className={`${styles.value} ${styles.roleBadge} ${
                  styles[userData?.role as keyof typeof styles]
                }`}
              >
                {userData?.role
                  ? userData.role.charAt(0).toUpperCase() +
                    userData.role.slice(1)
                  : ""}
              </span>
            </div>

            {userData?.role !== "admin" && userData?.employee_code && (
              <div className={styles.detailItem}>
                <span className={styles.label}>Employee Code:</span>
                <span className={styles.value}>{userData?.employee_code}</span>
              </div>
            )}

            {userData?.role === "admin" && userData?.department && (
              <div className={styles.detailItem}>
                <span className={styles.label}>Department:</span>
                <span className={styles.value}>{userData?.department}</span>
              </div>
            )}
            {userData && (
              <div className={styles.detailItem}>
                <span className={styles.label}>Log out:</span>
                <button className={styles.logout} onClick={() => resetCookie()}>
                  Logout
                </button>
              </div>
            )}
            {userData.role==="admin" && (
              <div className={styles.detailItem}>
                <span className={styles.label}>
                  Delete this account({userData?.role}):
                </span>
                <button className={styles.delete} onClick={deleteUser}>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
