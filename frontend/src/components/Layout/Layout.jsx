import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-full min-h-screen bg-[#f8faf9]">
      <div className="mx-auto flex min-h-screen max-w-[1400px] relative">
        
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col transition-all duration-300 w-full lg:w-[calc(100%-16rem)]">
          <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden w-full max-w-[100vw]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
