// PostCard.jsx
import React from "react";
import { MoreHorizontal, Heart, MessageCircle } from "lucide-react";
import Tag from "../components/Tag";
import InteractionButton from "./InteractionButton";

// Tag colors for skills
const getTagColor = (index) => {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-red-100 text-red-800",
    "bg-emerald-100 text-emerald-800",
  ];
  return colors[index % colors.length];
};

const PostCard = ({ post = {} }) => {
  const {
    name = "Unknown",
    title = "",
    avatarInitials = "U",
    profilePhoto = null,
    timeAgo = "",
    skills = [],
    content = "No content available.",
    imageUrl = "",
    likes = 0,
    comments = 0,
  } = post;

  // Generate safe initials
  const initials = avatarInitials
    ? avatarInitials
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  // Filter skills to avoid empty strings or null
  const validSkills = Array.isArray(skills) ? skills.filter(Boolean) : [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6 transition-all duration-300 hover:shadow-xl hover:border-gray-200 cursor-pointer w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold text-white shadow-inner overflow-hidden bg-gray-300">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/48x48/cccccc/FFFFFF?text=U";
                }}
              />
            ) : (
              initials
            )}
          </div>
          <div className="max-w-xs">
            <p className="text-lg font-semibold text-gray-900 truncate hover:text-sky-600 transition-colors">
              {name}
            </p>
            {title && (
              <p className="text-sm text-gray-500 truncate">{title}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end">
          {timeAgo && <p className="text-sm text-gray-400 mt-1">{timeAgo}</p>}
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Skills/Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        {validSkills.length > 0 ? (
          validSkills.map((skill, index) => (
            <Tag key={`${skill}-${index}`} color={getTagColor(index)}>
              {skill}
            </Tag>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No skills listed</p>
        )}
      </div>

      {/* Post Content */}
      <p className="text-gray-700 mb-5 leading-relaxed break-words">{content}</p>

      {/* Image */}
      {imageUrl && (
        <div className="mb-5 rounded-xl overflow-hidden shadow-sm border border-gray-200 max-h-96">
          <img
            src={imageUrl}
            alt="Post media"
            className="w-full h-auto object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/800x400/000000/FFFFFF?text=Media+Unavailable";
            }}
          />
        </div>
      )}

      {/* Interaction Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <InteractionButton icon={Heart} count={likes || 0} label="Like" />
          <InteractionButton
            icon={MessageCircle}
            count={comments || 0}
            label="Comment"
          />
        </div>
        <button
          onClick={() => console.log("Report clicked")}
          className="text-xs text-gray-500 hover:text-red-500 transition-colors"
        >
          Report
        </button>
      </div>
    </div>
  );
};

export default PostCard;
