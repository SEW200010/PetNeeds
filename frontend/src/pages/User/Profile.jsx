import Header from "../../components/User/UserHeader";
import UserSidebar from '@/components/User/UserSidebar'
import FacilitatorSidebar from '@/components/Facilitator/FacilitatorSidebar'
import CoordinatorSidebar from '@/components/Coordinator/CoordinatorSidebar'
import AdminSidebar from '@/components/Admin/AdminSidebar'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import AddEmailAddress from '@/components/User/AddEmailAddress'
import ProfileImageUploader from '@/components/User/ProfileImageUploader'
import FacilitatorHeader from '@/components/Facilitator/FacilitatorHeader'
import CoordinatorHeader from '@/components/Coordinator/CoordinatorHeader'
//import AdminHeader from '@/components/Admin/AdminHeader'
function Profile() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const API = import.meta.env.VITE_API_BASE_URL

  // ✅ Fetch user details
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const decoded = jwtDecode(token)
    const userId = decoded.sub || decoded.user_id

    axios
      .get(`${API}/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error('Error loading user:', err))
  }, [])

  if (!user) return <div className="text-center mt-10">Loading...</div>

  // ✅ Sidebar selection
  const getSidebar = () => {
    switch (user.role) {
      case 'admin':
        return <AdminSidebar />
      case 'facilitator':
        return <FacilitatorSidebar />
      case 'coordinator':
        return <CoordinatorSidebar />
      default:
        return <UserSidebar />
    }
  }

  // header selection 
  const getHeader = () => {
  switch (user.role) {
    case 'admin':
      return <AdminHeader title="Admin" />;
    case 'facilitator':
      return <FacilitatorHeader title="Facilitator" />;
    case 'coordinator':
      return <CoordinatorHeader title="Coordinator" />;
    default:
      return <UserHeader title="Student" />;
  }
};


  // ✅ Handle ToT confirmation
  const handleTotConfirm = async (checked) => {
    if (checked) {
      const confirmed = window.confirm(
        'Are you sure you have completed your ToT session?'
      )
      if (!confirmed) return
    }

    setUser((prev) => ({ ...prev, iotCompleted: checked }))

    if (checked) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(
          `${API}/add_facilitator`,
          { userId: user._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        alert('Facilitator ToT status updated successfully!')
        console.log('Backend response:', response.data)
      } catch (error) {
        console.error('Error adding facilitator:', error)
        alert('Failed to update facilitator details.')
      }
    }
  }

  return (
    <div>
      {getHeader()}
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          {getSidebar()}

          <div className="w-full md:w-3/4 px-2 py-4">
            <div className="max-w-10xl mx-auto">
              <h2 className="text-lg text-gray-700 font-semibold mb-1">
                Welcome, {user.fullname}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Joined:{' '}
                {user.joinedDate?.$date
                  ? new Date(user.joinedDate.$date).toLocaleDateString()
                  : user.joinedDate
                  ? new Date(user.joinedDate).toLocaleDateString()
                  : 'Unknown'}
              </p>

              <div className="max-w-5xl mx-auto mt-6">
                <div className="h-32 rounded-t-xl bg-gradient-to-r from-blue-200 via-purple-100 to-yellow-100" />
                <div className="bg-white rounded-b-xl -mt-10 shadow-lg p-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <ProfileImageUploader user={user} setUser={setUser} />
                      <div>
                        <h2 className="text-xl font-semibold">
                          {user.fullname}
                        </h2>
                        <p className="text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/profile/profile-edit')}
                      className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
                    >
                      Edit
                    </button>
                  </div>

                  {/* ✅ Facilitator-only ToT Session Completion section */}
                  {user.role === 'facilitator' && (
                    <div className="mt-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
                        <span className="text-2xl">⚙️</span> ToT Training
                        Progress
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Confirm once you have completed your ToT session period
                        during training.
                      </p>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="iotCompleted"
                          checked={user.iotCompleted || false}
                          onChange={(e) =>
                            handleTotConfirm(e.target.checked)
                          }
                          className="h-5 w-5 text-blue-600 cursor-pointer accent-blue-600"
                        />
                        <label
                          htmlFor="iotCompleted"
                          className="text-gray-800 font-medium"
                        >
                          I have completed my ToT session
                        </label>
                      </div>

                      {user.iotCompleted && (
                        <div className="mt-4 bg-green-100 border border-green-200 rounded-lg px-4 py-2 text-green-700 text-sm font-medium flex items-center gap-2">
                          ✅ ToT session marked as completed
                        </div>
                      )}
                    </div>
                  )}

                  {/* ✅ Profile details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {[
                      { label: 'Full Name', value: user.fullname },
                      { label: 'Email', value: user.email },
                      { label: 'User Type', value: user.role },
                      { label: 'Address', value: user.address },
                      {
                        label:
                          user.organization_unit?.toLowerCase() ===
                          'university'
                            ? 'University Name'
                            : user.organization_unit?.toLowerCase() === 'school'
                            ? 'School Name'
                            : 'Organization',
                        value:
                          user.organization_unit?.toLowerCase() === 'university'
                            ? user.university_name
                            : user.organization_unit?.toLowerCase() === 'school'
                            ? user.school_name
                            : user.organization_unit,
                      },
                      { label: 'Contact', value: user.contact },
                    ].map((item, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {item.label}
                        </label>
                        <div className="bg-gray-100 px-4 py-3 rounded-md text-gray-600">
                          {item.value || '—'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <AddEmailAddress user={user} setUser={setUser} />
                    <div>
                      <button
                        onClick={() => navigate('/profile/change-password')}
                        className="w-full md:w-auto px-4 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition block"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
