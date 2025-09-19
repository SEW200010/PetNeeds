import React from 'react'

import UserSidebar from '@/components/User/UserSidebar'
const User = () => {
  return (
    
    <div>
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <UserSidebar />
        </div>
      </main>
    </div>
  )
}

export default User