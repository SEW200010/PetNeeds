import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  AlertCircle,
  Search,
} from "lucide-react";
import FacilitatorSidebar from "@/components/Facilitator/FacilitatorSidebar";
import Header from "@/components/Facilitator/FacilitatorHeader";

// Dummy data for TOT sessions
const dummyTOTSessions = [
  {
    id: 1,
    title: "Basic Counseling Skills",
    description: "Master the fundamentals of active listening and empathetic communication.",
    instructor: "Dr. Sarah Johnson",
    date: "2025-11-25",
    time: "09:00 AM - 12:00 PM",
    location: "Training Center A, Room 101",
    capacity: 30,
    enrolled: 25,
    status: "upcoming",
    duration: "3 days",
    level: "Beginner",
    topics: ["Active Listening", "Empathy", "Communication Skills"],
  },
  {
    id: 2,
    title: "Advanced Counseling Techniques",
    description: "Learn advanced therapeutic interventions and case management strategies.",
    instructor: "Prof. Michael Chen",
    date: "2025-12-01",
    time: "02:00 PM - 05:00 PM",
    location: "Training Center B, Room 202",
    capacity: 25,
    enrolled: 20,
    status: "ongoing",
    duration: "5 days",
    level: "Intermediate",
    topics: ["Therapy Techniques", "Case Management", "Crisis Intervention"],
  },
  {
    id: 3,
    title: "Youth Counseling Specialization",
    description: "Specialized training for counseling adolescents and young adults.",
    instructor: "Dr. Emily Rodriguez",
    date: "2025-12-10",
    time: "10:00 AM - 01:00 PM",
    location: "Training Center A, Room 103",
    capacity: 20,
    enrolled: 18,
    status: "upcoming",
    duration: "4 days",
    level: "Intermediate",
    topics: ["Adolescent Psychology", "Youth Development", "Peer Support"],
  },
  {
    id: 4,
    title: "Family Counseling Workshop",
    description: "Comprehensive training on family dynamics and family therapy methods.",
    instructor: "Dr. James Wilson",
    date: "2025-12-15",
    time: "09:00 AM - 04:00 PM",
    location: "Training Center C, Room 301",
    capacity: 35,
    enrolled: 28,
    status: "completed",
    duration: "2 days",
    level: "Advanced",
    topics: ["Family Dynamics", "Systems Theory", "Conflict Resolution"],
  },
  {
    id: 5,
    title: "Mental Health Assessment",
    description: "Learn to conduct comprehensive mental health assessments and evaluations.",
    instructor: "Dr. Patricia Lee",
    date: "2025-11-20",
    time: "11:00 AM - 02:00 PM",
    location: "Training Center B, Room 205",
    capacity: 25,
    enrolled: 24,
    status: "ongoing",
    duration: "3 days",
    level: "Intermediate",
    topics: ["Assessment Tools", "Diagnosis", "Treatment Planning"],
  },
  {
    id: 6,
    title: "Cultural Competence in Counseling",
    description: "Develop skills to work effectively with diverse cultural backgrounds.",
    instructor: "Dr. Rajesh Patel",
    date: "2025-12-20",
    time: "03:00 PM - 06:00 PM",
    location: "Training Center A, Room 102",
    capacity: 30,
    enrolled: 22,
    status: "upcoming",
    duration: "2 days",
    level: "Beginner",
    topics: ["Cultural Awareness", "Diversity", "Inclusion"],
  },
];

export default function TOTSessions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSession, setSelectedSession] = useState(null);

  const filteredSessions = dummyTOTSessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "ongoing":
        return <AlertCircle className="h-4 w-4" />;
      case "upcoming":
        return <Calendar className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    

    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="pt-[65px] flex flex-col md:flex-row">
        <FacilitatorSidebar />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Training of Trainers (TOT) Sessions
          </h1>
          <p className="text-gray-600">
            Explore and enroll in pre-training sessions to become a verified facilitator.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title or instructor name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedSession(session)}
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <span
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    session.status
                  )}`}
                >
                  {getStatusIcon(session.status)}
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {session.level}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {session.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {session.description}
                </p>

                {/* Instructor */}
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Instructor:</span>{" "}
                    {session.instructor}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{session.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="truncate">{session.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>
                      {session.enrolled} / {session.capacity} enrolled
                    </span>
                  </div>
                </div>

                {/* Enrollment Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(session.enrolled / session.capacity) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Topics */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {session.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                    session.status === "completed"
                      ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                      : session.status === "ongoing"
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  disabled={session.status === "completed"}
                >
                  {session.status === "completed"
                    ? "Completed"
                    : session.status === "ongoing"
                    ? "In Progress"
                    : "Enroll Now"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No sessions found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Modal for Session Details */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedSession.title}
                </h2>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-600 mb-4">{selectedSession.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Instructor</p>
                  <p className="text-gray-900">{selectedSession.instructor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Duration</p>
                  <p className="text-gray-900">{selectedSession.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Date & Time</p>
                  <p className="text-gray-900">
                    {selectedSession.date} at {selectedSession.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Location</p>
                  <p className="text-gray-900">{selectedSession.location}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 font-semibold mb-2">
                  Topics Covered
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedSession.topics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedSession(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  disabled={selectedSession.status === "completed"}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold ${
                    selectedSession.status === "completed"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {selectedSession.status === "completed"
                    ? "Already Completed"
                    : "Enroll"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
