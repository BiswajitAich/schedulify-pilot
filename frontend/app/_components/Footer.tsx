import styles from "@/app/styles/Footer.module.css";
const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          © {new Date().getFullYear()} Employee Shift DashBoard
        </div>

        <div className={styles.footerRight}>
          <a href="#" className={styles.footerLink}>
            Privacy
          </a>
          <a href="#" className={styles.footerLink}>
            Terms
          </a>
          <a href="#" className={styles.footerLink}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
