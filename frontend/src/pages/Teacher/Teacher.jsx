import React from 'react'
import TeacherSidebar from "../../components/Teacher/TeacherSidebar"
import Header from '@/components/Header'
import SelectActionCard from '@/components/Teacher/ActionCard'
const Teacher = () => {
    return (

        <div>
            <Header />
            <main className=' pt-[65px] min-h-screen '>
                <div className="flex flex-col md:flex-row">
                    <TeacherSidebar />

                     <div className="w-full md:w-3/4 p-6">

                     <div className="text-2xl bold pb-10"> Welcome to Teacher Dashboard !</div>
                    <SelectActionCard/>
                     </div>
                </div>

            </main>

        </div>

    )
}

export default Teacher