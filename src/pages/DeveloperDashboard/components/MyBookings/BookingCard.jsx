import React from "react";
import { Calendar, Clock } from "lucide-react";

export default function BookingCard({ session, showMenteeInfo = false }) {
  if (!session || !(session.mentorId || session.mentor)) return null;

  const mentor = session.mentorId || session.mentor || {};
  if (!mentor.name) return null; // Hides Unknown Mentor
  const status = (session.status || '').toLowerCase();
  const statusStyle = status === 'completed'
    ? 'bg-green-100 text-green-700 border-green-200'
    : status === 'cancelled'
    ? 'bg-red-100 text-red-700 border-red-200'
    : 'bg-blue-100 text-blue-700 border-blue-200';
  const mentee = session.menteeId || session.mentee || {};

  const menteeName = mentee.name || "Unknown Mentee";
  const menteePhoto = mentee.profilePhoto;
  const menteeInitials = menteeName[0]?.toUpperCase() || "M";
  const mentorName = mentor.name || "Unknown Mentor";
  const mentorPhoto = mentor.profilePhoto;
  const mentorInitials = mentorName[0]?.toUpperCase() || "M";
  const mentorExperience =
    mentor.mentorProfile?.experience || mentor.title || "Experience not provided";
  // Skill extraction logic
  let mentorSkills = [];
  if (Array.isArray(mentor.skills) && mentor.skills.length > 0) {
    mentorSkills = mentor.skills.map(skill => typeof skill === "string" ? skill : skill?.name);
  } else if (Array.isArray(mentor.mentorProfile?.expertise)) {
    mentorSkills = mentor.mentorProfile.expertise.map(skill => typeof skill === "string" ? skill : skill?.name);
  }
  const sessionTopic = mentorSkills[0]
    ? `${mentorSkills[0]} Session`
    : "General Mentorship Session";

  // Date and time formatting
  let dateString = "";
  const bookingDate = session.date || session.sessionDate;
  if (bookingDate) {
    try {
      const dateObj = new Date(bookingDate);
      if (!isNaN(dateObj.getTime())) {
        dateString = dateObj.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        });
      }
    } catch { /* empty */ }
  }
  const slotString = session.slot || session.time || (session.startTime && session.endTime ? `${session.startTime} - ${session.endTime}` : "Time not specified");
  const fullSessionTime =
    (dateString ? dateString : "Date not specified") +
    (slotString ? `, ${slotString}` : "");

  return (
     
    <div className="bg-white rounded-xl shadow-sm border p-5 mb-6 flex items-center justify-between">
      {/* LEFT SECTION */}
      <div className="flex flex-col flex-shrink-0">
        {/* Mentor Info */}
        <div className="flex items-center gap-3 mb-3">
          {mentorPhoto ? (
            <img src={mentorPhoto} alt={mentorName} className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-xl text-white font-semibold">{mentorInitials}</div>
          )}
          <div>
            <div className="flex items-center gap-3">
              <div className="text-lg font-semibold text-gray-800">{mentorName}</div>
              {status && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${statusStyle}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">{mentorExperience}</div>
          </div>
        </div>
        <div className="bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1 rounded w-fit mb-3">{sessionTopic}</div>
        {showMenteeInfo && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-600">Mentee -</span>
            {menteePhoto ? (
              <img src={menteePhoto} alt={menteeName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-base text-white font-semibold">{menteeInitials}</div>
            )}
            <span className="text-xs text-gray-700 font-medium">{menteeName}</span>
          </div>
        )}
      </div>
      {/* MIDDLE SECTION — DATE & TIME */}
      <div className="flex flex-col flex-grow px-8 text-gray-700">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>{fullSessionTime}</span>
        </div>
      </div>
      {/* RIGHT SECTION — ACTION BUTTONS */}
      <div className="flex flex-col items-end gap-2">
        <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-4 0H5a2 2 0 01-2-2V8a2 2 0 012-2h6a2 2 0 012 2v4z" />
          </svg>
          Join Call
        </button>
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded border hover:bg-gray-200 transition font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 4V10a2 2 0 012-2h2" />
          </svg>
          Chat
        </button>
      </div>
    </div>
  );
}
