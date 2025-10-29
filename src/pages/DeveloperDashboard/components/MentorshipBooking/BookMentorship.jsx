import React from "react";
import PremiumBanner from "./PremiumBanner";
import MentorCard from "./MentorCard";

export default function BookMentorship({ mentors }) {
  return (
    <div className="max-w-4xl mx-auto pt-8 px-4">
      <PremiumBanner />
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Available Mentors ({mentors?.length || 0})
      </h2>
      {(mentors && mentors.length > 0
        ? mentors.map((mentor, idx) => (
            <MentorCard key={mentor.id || idx} mentor={mentor} />
          ))
        : (
          <div className="p-6 text-gray-500 text-center bg-white rounded-xl shadow border">
            No mentors found.
          </div>
        )
      )}
    </div>
  );
}
