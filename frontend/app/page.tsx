import Footer from "./_components/Footer";
import styles from "./page.module.css";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div>
      <div className={styles.landingContainer}>
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Employee Shift Board</h1>

          <p className={styles.heroSubtitle}>
            A simple, powerful dashboard to manage employee work shifts with
            ease. Secure login, smart scheduling, and clean UI built for admins
            and employees.
          </p>

          <div className={styles.ctaButtons}>
            <Link href="/home" className={styles.primaryButton}>
              Get Started
            </Link>

            <Link href="/about" className={styles.secondaryButton}>
              Learn More
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
