import React from "react";
import FacilitorSidebar from "@/components/Facilitator/FacilitatorSidebar";
import Header from "@/components/Facilitator/FacilitatorHeader";
import SettingsPanel from "@/components/SettingsPanel";

const Settings = () => {

  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <FacilitorSidebar />

          <div className="w-full md:w-3/4 p-6">
            <SettingsPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
