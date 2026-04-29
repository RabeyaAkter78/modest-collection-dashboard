"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/layout/AuthGuard";
import ToastContainer from "@/components/ui/ToastContainer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
      <ToastContainer />
    </AuthGuard>
  );
}
