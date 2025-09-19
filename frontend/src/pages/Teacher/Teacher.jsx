import React, { useEffect, useState } from 'react';
import TeacherSidebar from "../../components/Teacher/TeacherSidebar";
import Header from '@/components/Header';
import SelectActionCard from '@/components/Teacher/ActionCard';
import { useNavigate } from 'react-router-dom';

const Teacher = () => {
  const navigate = useNavigate();
  const [teacherName, setTeacherName] = useState('');

  useEffect(() => {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  if (!role || role !== "teacher-in-charge") {
    alert("Access denied. Only teachers in charge can access this page.");
    navigate("/login");
    return;
  }

  setTeacherName(name || "Teacher");
}, [navigate]);


  return (
    <div>
      <Header />
      <main className='pt-[65px] min-h-screen'>
        <div className="flex flex-col md:flex-row">
          <TeacherSidebar />
          <div className="w-full md:w-3/4 p-6">
            <div className="text-2xl font-bold pb-10">
              Welcome, {teacherName}!
            </div>
            <SelectActionCard/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Teacher;
