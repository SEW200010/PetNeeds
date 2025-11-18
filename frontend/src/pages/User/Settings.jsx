import React from "react";
import StudentSidebar from "@/components/User/UserSidebar";
import Header from "@/components/User/UserHeader";
import SettingsPanel from "@/components/SettingsPanel";

const Settings = () => {

  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <StudentSidebar />

          <div className="w-full md:w-3/4 p-6">
            <SettingsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;



