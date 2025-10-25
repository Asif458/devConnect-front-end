import React, { useState } from "react";
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Flag,
  X,
  Send,
  Trash2,
  Pencil,
} from "lucide-react";
import api from "../../../api/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import EditPostModal from "./EditPostModal";

dayjs.extend(relativeTime);

const PostCard = ({ post, currentUserId, onDelete, onUpdate }) => {
  const {
    _id,
    userId,
    content,
    mediaUrls,
    likes,
    comments: initialComments,
    createdAt,
    hashtags,
    reportCount: initialReportCount,
  } = post;

  const [liked, setLiked] = useState(likes?.includes(currentUserId) || false);
  const [likeCount, setLikeCount] = useState(likes?.length || 0);
  const [, setReportCount] = useState(initialReportCount || 0);
  const [comments, setComments] = useState(initialComments || []);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredComment, setHoveredComment] = useState(null);

  // Edit functionality
  const [showEditModal, setShowEditModal] = useState(false);
  const [postContent, setPostContent] = useState(content);
  const [postImage, setPostImage] = useState(mediaUrls?.[0] || null);

  const timeAgo = createdAt ? dayjs(createdAt).fromNow() : "";
  const COMMENTS_TO_SHOW = 2;
  const isOwner = currentUserId === userId?._id;

  const handleLike = async () => {
    try {
      const res = await api.post(`/post/${_id}/like`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likes);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleReport = async () => {
    if (!window.confirm("Are you sure you want to report this post?")) return;

    try {
      await api.post(`/post/${_id}/report`);
      setReportCount((prev) => prev + 1);
      alert("Post reported successfully! Our team will review it.");
      setShowMenu(false);
    } catch (err) {
      console.error("Error reporting post:", err);
      alert(
        err.response?.data?.error || "Failed to report post. Please try again."
      );
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/post/${_id}`);
      if (onDelete) onDelete(_id);
      alert("Post deleted successfully!");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleEditClick = () => {
    setShowMenu(false);
    setShowEditModal(true);
  };

  const handleUpdatePost = async (updatedContent, updatedImage) => {
    try {
      const formData = new FormData();
      formData.append("content", updatedContent);

      if (updatedImage && updatedImage instanceof File) {
        formData.append("image", updatedImage);
      }

      const res = await api.put(`/post/${_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPostContent(res.data.content);
      setPostImage(res.data.mediaUrls?.[0] || null);

      if (onUpdate) onUpdate(res.data);
      alert("Post updated successfully!");
    } catch (err) {
      console.error("Error updating post:", err);
      alert(
        "Failed to update post: " + (err.response?.data?.error || err.message)
      );
      throw err;
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/post/${_id}/comment`, { text: commentText });
      setComments((prev) => [...prev, res.data]);
      setCommentText("");
      setShowCommentInput(false);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await api.delete(`/post/${_id}/comment/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert(
        "Failed to delete comment: " +
          (err.response?.data?.error || err.message)
      );
    }
  };

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  const displayedComments = showAllComments
    ? comments
    : comments.slice(0, COMMENTS_TO_SHOW);
  const hasMoreComments = comments.length > COMMENTS_TO_SHOW;

  const getSkillNames = () => {
    if (!userId?.skills || userId.skills.length === 0) return [];

    const skillNames = [];

    for (const skill of userId.skills) {
      let skillName = null;

      if (typeof skill === "string") {
        if (!skill.match(/^[0-9a-fA-F]{24}$/)) {
          skillName = skill;
        }
      } else if (skill && typeof skill === "object") {
        skillName = skill.name || skill.skill || skill.skillName || null;
      }

      if (
        skillName &&
        typeof skillName === "string" &&
        skillName.trim().length > 0
      ) {
        skillNames.push(skillName.trim());
      }
    }

    return skillNames;
  };

  const skillNames = getSkillNames();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 transition-all hover:shadow-md w-full">
        {/* Header */}
        <div className="flex justify-between items-start p-4 md:p-6 pb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-base font-semibold text-white shadow-sm overflow-hidden bg-gradient-to-br from-sky-400 to-blue-500 flex-shrink-0 ring-2 ring-transparent group-hover:ring-sky-300 transition-all duration-200">
                {userId?.profilePhoto ? (
                  <img
                    src={userId.profilePhoto}
                    alt={userId.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                      e.target.parentElement.textContent = getInitials(
                        userId?.name
                      );
                    }}
                  />
                ) : (
                  getInitials(userId?.name)
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-semibold text-gray-900 hover:text-sky-600 hover:underline transition-all cursor-pointer truncate">
                {userId?.name || "Unknown User"}
              </p>
              <p className="text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                {timeAgo}
              </p>
            </div>
          </div>

          {/* More Options Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  {isOwner ? (
                    <>
                      <button
                        onClick={handleEditClick}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-t-lg"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit Post
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Post
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleReport}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-lg"
                    >
                      <Flag className="w-4 h-4" />
                      Report Post
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Skills */}
        {skillNames.length > 0 && (
          <div className="px-4 md:px-6 pb-3 flex flex-wrap gap-2">
            {skillNames.slice(0, 3).map((skillName, i) => (
              <span
                key={`skill-${i}-${skillName}`}
                className="px-2 md:px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                {skillName}
              </span>
            ))}
            {skillNames.length > 3 && (
              <span className="px-2 md:px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">
                +{skillNames.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Content */}
        {postContent && (
          <div className="px-4 md:px-6 pb-3">
            <p className="text-gray-800 text-sm md:text-[15px] leading-relaxed break-words whitespace-pre-wrap">
              {postContent}
            </p>
          </div>
        )}
{/* Image - Simple & Perfect for All Types */}
{postImage && (
  <div className="w-full bg-gradient-to-b from-gray-900 to-black">
    <div className="relative w-full flex items-center justify-center cursor-pointer group" 
         onClick={() => setShowFullImage(true)}>
      <img
        src={postImage}
        alt="Post media"
        className="max-w-full h-auto transition-opacity duration-200 group-hover:opacity-95"
        style={{
          display: 'block',
          maxHeight: '700px',
          objectFit: 'contain',
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/600x400/e5e7eb/6b7280?text=Image+Not+Found";
        }}
      />
    </div>
  </div>
)}



        {/* Full Image Modal */}
        {showFullImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
            onClick={() => setShowFullImage(false)}
          >
            <img
              src={postImage}
              alt="Post media full"
              className="max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullImage(false);
              }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Hashtags */}
        {hashtags?.length > 0 && (
          <div className="px-4 md:px-6 py-2 flex flex-wrap gap-2">
            {hashtags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs text-sky-600 hover:text-sky-700 hover:underline cursor-pointer font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Interaction Stats - LEFT ALIGNED */}
        <div className="px-4 md:px-6 py-2.5 flex items-center justify-between text-xs md:text-sm text-gray-500 border-b border-gray-100">
          <div className="flex items-center gap-4">
            {likeCount > 0 && (
              <button className="hover:underline cursor-pointer flex items-center gap-1.5 group">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-3 h-3 fill-white text-white" />
                </div>
                <span className="font-medium text-gray-600">{likeCount}</span>
              </button>
            )}
            {comments.length > 0 && (
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                className="hover:underline cursor-pointer font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {comments.length}{" "}
                {comments.length === 1 ? "comment" : "comments"}
              </button>
            )}
          </div>
        </div>

        {/* Interaction Buttons - LEFT ALIGNED with better spacing */}
        <div className="px-4 md:px-6 py-2 flex items-center border-b border-gray-100">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all hover:bg-gray-100 ${
              liked ? "text-red-600" : "text-gray-600"
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                liked ? "fill-red-600" : ""
              }`}
            />
            <span className="text-sm font-semibold">Like</span>
          </button>

          <button
            onClick={() => setShowCommentInput(!showCommentInput)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all hover:bg-gray-100 ${
              showCommentInput ? "text-sky-600" : "text-gray-600"
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Comment</span>
          </button>

          {!isOwner && (
            <button
              onClick={handleReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
            >
              <Flag className="w-5 h-5" />
              <span className="text-sm font-semibold hidden sm:inline">
                Report
              </span>
            </button>
          )}
        </div>

        {/* Comments Section */}
        {displayedComments.length > 0 && (
          <div className="px-4 md:px-6 pt-4 pb-2 flex flex-col gap-3">
            {displayedComments.map((c) => {
              const isCommentOwner = currentUserId === c.userId?._id;
              return (
                <div
                  key={c._id}
                  className="flex items-start gap-2.5 group"
                  onMouseEnter={() => setHoveredComment(c._id)}
                  onMouseLeave={() => setHoveredComment(null)}
                >
                  <div className="relative group/avatar cursor-pointer flex-shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-transparent group-hover/avatar:ring-sky-300 transition-all duration-200">
                      {c.userId?.profilePhoto ? (
                        <img
                          src={c.userId.profilePhoto}
                          alt={c.userId.name}
                          className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            e.target.parentElement.textContent = getInitials(
                              c.userId?.name
                            );
                          }}
                        />
                      ) : (
                        getInitials(c.userId?.name)
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="relative">
                      <div className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-2xl px-3.5 py-2 inline-block max-w-full">
                        <p className="text-xs md:text-sm font-semibold text-gray-900 hover:text-sky-600 hover:underline cursor-pointer transition-colors">
                          {c.userId?.name || "Unknown User"}
                        </p>
                        <p className="text-xs md:text-sm text-gray-800 mt-0.5 break-words leading-relaxed">
                          {c.text}
                        </p>
                      </div>
                      {isCommentOwner && hoveredComment === c._id && (
                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          className="absolute -right-1 top-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-all shadow-md"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 px-3">
                      <button className="text-xs text-gray-500 hover:text-gray-700 font-semibold hover:underline transition-colors">
                        Like
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700 font-semibold hover:underline transition-colors">
                        Reply
                      </button>
                      <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                        {dayjs(c.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {hasMoreComments && (
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                className="text-sm text-gray-600 hover:text-gray-900 font-semibold hover:underline text-left px-2 py-1 transition-colors"
              >
                {showAllComments
                  ? "View less comments"
                  : `View ${comments.length - COMMENTS_TO_SHOW} more ${
                      comments.length - COMMENTS_TO_SHOW === 1
                        ? "comment"
                        : "comments"
                    }`}
              </button>
            )}
          </div>
        )}

        {/* Comment Input */}
        {showCommentInput && (
          <div className="px-4 md:px-6 pb-4 pt-3 border-t border-gray-100">
            <div className="flex gap-2.5 items-end">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-br from-sky-400 to-blue-500 flex-shrink-0">
                U
              </div>
              <div className="flex-1 relative">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none bg-gray-50 hover:bg-gray-100 transition-all"
                  rows="1"
                  style={{
                    minHeight: "40px",
                    maxHeight: "120px",
                  }}
                  onInput={(e) => {
                    e.target.style.height = "40px";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className={`absolute right-2.5 bottom-2.5 p-1.5 rounded-full transition-all ${
                    commentText.trim()
                      ? "text-sky-600 hover:bg-sky-100 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        initialContent={postContent}
        initialImage={postImage}
        onUpdate={handleUpdatePost}
      />
    </>
  );
};

export default PostCard;
