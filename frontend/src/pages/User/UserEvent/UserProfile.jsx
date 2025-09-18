import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"

export default function UserProfile() {
  const [user] = useState({
    name: "Amanda Johnson",
    email: "amanda@example.com",
    joinDate: "June 2022",
    eventsAttended: 12,
    upcomingEvents: 3,
  })

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt={user.name} />
              <AvatarFallback className="text-lg">AJ</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">Member since {user.joinDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-teal-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-teal-600">{user.eventsAttended}</p>
              <p className="text-sm text-gray-600">Events Attended</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-600">{user.upcomingEvents}</p>
              <p className="text-sm text-gray-600">Upcoming Events</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button className="bg-teal-600 hover:bg-teal-700">Edit Profile</Button>
            <Button variant="outline">Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
