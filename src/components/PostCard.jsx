import React from 'react';
import { MoreHorizontal, Heart, MessageCircle } from 'lucide-react';
import Tag from '../components/Tag';
import InteractionButton from '../components/InteractionButton';

const PRIMARY_COLOR = '#043873';

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

const PostCard = ({ post }) => {
  const handleProfileClick = () => {
    console.log(`Navigating to ${post.name}'s profile...`);
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
            {post.avatarInitials}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 hover:text-sky-600 transition-colors">
              {post.name}
            </p>
            <p className="text-sm text-gray-500">{post.title}</p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-sm text-gray-400 mt-1">{post.timeAgo}</p>
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Skills/Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        {post.skills.map((skill, index) => (
          <Tag key={skill} color={getTagColor(index)}>
            {skill}
          </Tag>
        ))}
      </div>

      {/* Post Content */}
      <p className="text-gray-700 mb-5 leading-relaxed">
        {post.content}
      </p>

      {/* Image/Media */}
      {post.imageUrl && (
        <div className="mb-5 rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <img
            src={post.imageUrl}
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

      {/* Interaction Buttons and small Report */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <InteractionButton icon={Heart} count={post.likes} label="Like" />
          <InteractionButton icon={MessageCircle} count={post.comments} label="Comment" />
        </div>

        {/* Small inline report */}
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
