// import React, { useEffect } from "react";
// import PremiumBanner from "./PremiumBanner";
// import MentorCard from "./MentorCard";
// import useMentorshipStore from "../../../../ZustandStore/mentorshipStore"; // adjust import as needed

// export default function BookMentorship() {
//   const { mentors, loading, error, fetchMentors } = useMentorshipStore();

//   useEffect(() => {
//     fetchMentors();
//   }, [fetchMentors]);

//   return (
//     <div className="max-w-4xl mx-auto pt-8 px-4">
//       <PremiumBanner />
//       <h2 className="text-xl font-bold text-gray-800 mb-6">
//         Available Mentors ({mentors.length})
//       </h2>

//       {loading ? (
//         <div className="p-6 text-gray-500 text-center bg-white rounded-xl shadow border">
//           Loading mentors...
//         </div>
//       ) : error ? (
//         <div className="text-red-500">{error}</div>
//       ) : mentors.length === 0 ? (
//         <div className="p-6 text-gray-500 text-center bg-white rounded-xl shadow border">
//           No mentors found.
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {mentors.map((mentor) => (
//             <MentorCard key={mentor._id} mentor={mentor} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect } from "react";
import PremiumBanner from "./PremiumBanner";
import MentorCard from "./MentorCard";
import useMentorshipStore from "../../../../ZustandStore/mentorshipStore";
import useAuthStore from "../../../../ZustandStore/useAuthStore";

export default function BookMentorship() {
  const { mentors, loadingMentors, error, fetchMentors } = useMentorshipStore();
  const { user, fetchUserProfile } = useAuthStore();

  useEffect(() => {
    fetchUserProfile(); // Always fetch user profile on mount
  }, [fetchUserProfile]);

  useEffect(() => {
    if (user?._id) fetchMentors();
  }, [fetchMentors, user?._id]);

  console.log('[BookMentorship] user:', user);

  if (!user?._id) {
    return (
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="p-6 text-gray-500 text-center bg-white rounded-xl shadow border">
          Loading mentors...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-8 px-4">
      <PremiumBanner />
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Available Mentors ({mentors?.length || 0})
      </h2>

      {loadingMentors ? (
        <div className="p-6 text-gray-500 text-center bg-white rounded-xl shadow border">
          Loading mentors...
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : !mentors?.length ? (
        <div className="p-6 text-gray-500 text-center bg-white rounded-xl shadow border">
          No mentors found.
        </div>
      ) : (
        <div className="space-y-6">
          {mentors.map((mentor) => (
            <MentorCard key={mentor._id} mentor={mentor} />
          ))}
        </div>
      )}
    </div>
  );
}
