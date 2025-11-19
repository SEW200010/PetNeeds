import React from "react";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import Header from "@/components/Admin/header";
import SettingsPanel from "@/components/SettingsPanel";

const Settings = () => {

  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <AdminSidebar />

          <div className="w-full md:w-3/4 p-6">
            <SettingsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;



