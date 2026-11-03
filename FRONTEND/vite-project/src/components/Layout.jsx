import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout({ children, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f6fb]">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="lg:ml-64">
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;