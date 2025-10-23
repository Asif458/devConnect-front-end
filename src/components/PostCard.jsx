import React from "react";
import { MoreHorizontal, Heart, MessageCircle } from "lucide-react";
import Tag from "../components/Tag";
import InteractionButton from "../components/InteractionButton";

const PRIMARY_COLOR = "#043873";

/** Helper function to assign colors for each tag */
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
  // Destructure with defaults
  const {
    name = "Unknown",
    title = "",
    avatarInitials = "U",
    timeAgo = "",
    skills = [],
    content = "No content available.",
    imageUrl = "",
    likes = 0,
    comments = 0,
  } = post;

  const handleProfileClick = () => {
    console.log(`Navigating to ${name}'s profile...`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6 transition-all duration-300 hover:shadow-xl hover:border-gray-200 cursor-pointer">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4" onClick={handleProfileClick}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold text-white shadow-inner"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            {avatarInitials || "U"}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 hover:text-sky-600 transition-colors">
              {name || "Unknown"}
            </p>
            <p className="text-sm text-gray-500">{title || ""}</p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-sm text-gray-400 mt-1">{timeAgo || ""}</p>
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Skills/Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        {Array.isArray(skills) && skills.length > 0 ? (
          skills.map((skill, index) => (
            <Tag key={skill || index} color={getTagColor(index)}>
              {skill || "Unknown"}
            </Tag>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No skills listed</p>
        )}
      </div>

      {/* Post Content */}
      <p className="text-gray-700 mb-5 leading-relaxed">
        {content || "No content available."}
      </p>

      {/* Image/Media */}
      {imageUrl ? (
        <div className="mb-5 rounded-xl overflow-hidden shadow-sm border border-gray-200">
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
      ) : null}

      {/* Interaction Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <InteractionButton
            icon={Heart}
            count={typeof likes === "number" ? likes : 0}
            label="Like"
          />
          <InteractionButton
            icon={MessageCircle}
            count={typeof comments === "number" ? comments : 0}
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
