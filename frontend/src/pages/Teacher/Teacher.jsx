import React from 'react'
import TeacherSidebar from "../../components/Teacher/TeacherSidebar"
import Header from '@/components/Header'
const Teacher = () => {
    return (

        <div>
            <Header />
            <main className=' pt-[65px] min-h-screen '>
                <div className="flex flex-col md:flex-row">
                    <TeacherSidebar />

                     <div className="w-full md:w-3/4 px-4 py-6">
                     <div className="text-2xl bold"> Welcome to Teacher Dashboard !</div>
                    
                     </div>
                </div>

            </main>

        </div>

    )
}

export default Teacher