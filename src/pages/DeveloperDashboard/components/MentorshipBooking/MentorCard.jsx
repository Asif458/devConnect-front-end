// import React from "react";
// import SlotBadge from "./SlotBadge";

// export default function MentorCard({ mentor }) {
//   // Try to get profile image from nested structure safely
//   const profileImage =
//     mentor?.mentorProfile?.profileImage ||
//     mentor?.profileImage ||
//     mentor?.avatar ||
//     null;

//   const initials = mentor?.name
//     ? mentor.name
//         .split(" ")
//         .map((n) => n[0])
//         .join("")
//         .toUpperCase()
//     : "M";

//   return (
//     <div className="bg-white rounded-xl shadow-sm border px-8 py-6 mb-8 transition hover:shadow-md">
//       {/* --- Header with image and name --- */}
//       <div className="flex items-center gap-5 mb-3">
//         {/* Profile Image or Fallback */}
//         {profileImage ? (
//           <img
//             src={profileImage}
//             alt={mentor.name}
//             className="w-14 h-14 rounded-full object-cover border border-gray-200"
//           />
//         ) : (
//           <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-500">
//             {initials}
//           </div>
//         )}

//         <div>
//           <div className="font-bold text-lg text-gray-800 flex items-center">
//             {mentor.name}
//             {mentor.mentorRating?.average && (
//               <span className="ml-2 text-yellow-600 font-semibold text-base">
//                 ★ {mentor.mentorRating.average.toFixed(1)}
//               </span>
//             )}
//           </div>
//           <div className="text-xs text-gray-500">
//             {mentor.mentorProfile?.experience || "Experience not specified"}
//           </div>

//           <div className="flex gap-2 mt-2 flex-wrap">
//             {(mentor.skills || []).map((skill) => (
//               <span
//                 key={skill._id || skill}
//                 className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded border border-gray-200"
//               >
//                 {typeof skill === "string" ? skill : skill.name}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- Available Slots --- */}
//       <div className="mt-5">
//         <div className="text-sm font-semibold text-gray-700 mb-2">
//           Available Time Slots
//         </div>

//         <div className="flex gap-4 flex-wrap">
//           {(mentor.mentorProfile?.availability || []).flatMap((day) =>
//             day.slots.map((slot) => (
//               <SlotBadge
//                 key={slot._id}
//                 slot={slot}
//                 day={day}
//                 mentorId={mentor._id}
//                 availabilityId={day._id}
//               />
//             ))
//           )}

//           {(mentor.mentorProfile?.availability?.length === 0 ||
//             mentor.mentorProfile?.availability?.every(
//               (d) => d.slots.length === 0
//             )) && (
//             <span className="text-xs text-gray-400">No slots available</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import SlotBadge from "./SlotBadge";
 

export default function MentorCard({ mentor }) {
  if (!mentor) return null;

  const profile = mentor.mentorProfile || {};
  const profileImage =
    profile.profileImage || mentor.profileImage || mentor.avatar || null;

  const initials = mentor?.name
    ? mentor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "M";

  const availability = profile.availability || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border px-8 py-6 mb-8 transition hover:shadow-md">
      {/* --- Header --- */}
      <div className="flex items-center gap-5 mb-3">
        {profileImage ? (
          <img
            src={profileImage}
            alt={mentor.name}
            className="w-14 h-14 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-500">
            {initials}
          </div>
        )}

        <div>
          <div className="font-bold text-lg text-gray-800 flex items-center">
            {mentor.name}
            {mentor?.mentorRating?.average && (
              <span className="ml-2 text-yellow-600 font-semibold text-base">
                ★ {mentor.mentorRating.average.toFixed(1)}
              </span>
            )}
          </div>

          <div className="text-xs text-gray-500">
            {profile.experience || "Experience not specified"}
          </div>

          <div className="flex gap-2 mt-2 flex-wrap">
            {(mentor.skills || []).map((skill) => (
              <span
                key={skill._id || skill}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded border border-gray-200"
              >
                {typeof skill === "string" ? skill : skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* --- Availability --- */}
      <div className="mt-5">
        <div className="text-sm font-semibold text-gray-700 mb-2">
          Available Time Slots
        </div>

        <div className="flex gap-4 flex-wrap">
          {availability.length > 0 &&
          availability.some((d) => d.slots && d.slots.length > 0) ? (
            availability.flatMap((day) =>
              (day.slots || []).map((slot) => (
                <SlotBadge
                  key={slot._id}
                  slot={slot}
                  day={day}
                  mentorId={mentor._id}
                  availabilityId={day._id}
                />
              ))
            )
          ) : (
            <span className="text-xs text-gray-400">No slots available</span>
          )}
        </div>
      </div>
    </div>
  );
}
