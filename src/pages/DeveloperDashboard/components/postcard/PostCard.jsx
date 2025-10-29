import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  toggleLikePost,
  reportPost,
  deletePost as apiDeletePost,
  updatePost,
  addComment,
  deleteComment as apiDeleteComment
} from "../../../../api/postsApi";
import EditPostModal from "../postcard/EditPostModal";
import PostHeader from "../postcard/PostHeader";
import PostSkills from "../postcard/PostSkills";
import PostContent from "../postcard/PostContent";
import PostImage from "../postcard/PostImage";
import PostHashtags from "../postcard/PostHashtags";
import PostInteractions from "../postcard/PostInteractions";
import PostComments from "../postcard/PostComments";
import PostCommentInput from "../postcard/PostCommentInput";

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

  // State management
  const [liked, setLiked] = useState(likes?.includes(currentUserId) || false);
  const [likeCount, setLikeCount] = useState(likes?.length || 0);
  const [, setReportCount] = useState(initialReportCount || 0);
  const [comments, setComments] = useState(initialComments || []);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [postContent, setPostContent] = useState(content);
  const [postImage, setPostImage] = useState(mediaUrls?.[0] || null);

  const timeAgo = createdAt ? dayjs(createdAt).fromNow() : "";
  const isOwner = currentUserId === userId?._id;

  // Handlers
  const handleLike = async () => {
    try {
      const res = await toggleLikePost(_id);
      setLiked(res.data.liked);
      setLikeCount(res.data.likes);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleReport = async () => {
    if (!window.confirm("Are you sure you want to report this post?")) return;
    try {
      await reportPost(_id);
      setReportCount((prev) => prev + 1);
      alert("Post reported successfully! Our team will review it.");
    } catch (err) {
      console.error("Error reporting post:", err);
      alert(err.response?.data?.error || "Failed to report post. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await apiDeletePost(_id);
      if (onDelete) onDelete(_id);
      alert("Post deleted successfully!");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleUpdatePost = async (updatedContent, updatedImage) => {
    try {
      const res = await updatePost(_id, updatedContent, updatedImage);
      setPostContent(res.data.content);
      setPostImage(res.data.mediaUrls?.[0] || null);
      if (onUpdate) onUpdate(res.data);
      alert("Post updated successfully!");
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Failed to update post: " + (err.response?.data?.error || err.message));
      throw err;
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await addComment(_id, commentText);
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
      await apiDeleteComment(_id, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <><div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md max-w-4xl w-full p-6 mx-auto">

        <PostHeader
          userId={userId}
          timeAgo={timeAgo}
          isOwner={isOwner}
          onEdit={() => setShowEditModal(true)}
          onDelete={handleDelete}
          onReport={handleReport}
        />

        <PostSkills skills={userId?.skills} />
        <PostContent content={postContent} />
        <PostImage
          imageUrl={postImage}
          showFullImage={showFullImage}
          setShowFullImage={setShowFullImage}
        />
        <PostHashtags hashtags={hashtags} />

        <PostInteractions
          likeCount={likeCount}
          liked={liked}
          commentsCount={comments.length}
          isOwner={isOwner}
          onLike={handleLike}
          onComment={() => setShowCommentInput(!showCommentInput)}
          onReport={handleReport}
          showCommentInput={showCommentInput}
          showAllComments={showAllComments}
          setShowAllComments={setShowAllComments}
        />

        <PostComments
          comments={comments}
          currentUserId={currentUserId}
          showAllComments={showAllComments}
          setShowAllComments={setShowAllComments}
          onDeleteComment={handleDeleteComment}
        />

        {showCommentInput && (
          <PostCommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            onAddComment={handleAddComment}
          />
        )}
      </div>

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
