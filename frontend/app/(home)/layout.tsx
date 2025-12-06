import type { Metadata } from "next";
import Sidebar from "../_components/Sidebar";
import dynamic from "next/dynamic";
import styles from "@/app/(home)/home.module.css";
import { UserContextProvider } from "../_utils/user-contextProvider";

const Footer = dynamic(() => import("../_components/Footer"), {
  // ssr: false,
  loading: () => <Placeholder h="100px" />,
});

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className={styles.body}
      // style={{}}
    >
      <UserContextProvider>
        <Sidebar />
        <div className={styles.container}>
          {children}
          <Footer />
        </div>
      </UserContextProvider>
    </main>
  );
}

const Placeholder = ({ h }: { h: string }) => {
  return <div style={{ minHeight: h, minWidth: "100%" }} />;
};
