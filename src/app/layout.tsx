import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ToastContainer from "@/components/Toast";

export const metadata: Metadata = {
  title: "Prompt Engineering Studio",
  description: "Collaborative prompt engineering platform for AI model development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-gray-100 antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="ml-60 flex-1">{children}</main>
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
