import React, { useState, useEffect } from "react";
import PostCard from "./components/PostCard";
import Button from "../../components/Button";
import api from "../../api/axios";

export default function HomeFeed() {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/post");
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;
    try {
      const res = await api.post("/post", { content: newPost });
      setPosts([res.data, ...posts]);
      setNewPost("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Header */}
      <div className="mb-6 w-full">
        <h2 className="text-2xl font-bold text-gray-900">Community Feed</h2>
        <p className="text-gray-500">
          Latest updates from developers and mentors in your network
        </p>
      </div>

      {/* New Post Card */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-gray-100 mb-6 transition-all hover:shadow-lg w-full">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Create a New Post
        </h3>
        <div className="flex items-start space-x-4 w-full">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What new technology are you exploring today?"
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none bg-gray-50 w-full"
            rows="3"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="primary" className="text-sm" onClick={handlePostSubmit}>
            Post Update
          </Button>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 w-full">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={{
                ...post,
                name: post.userId?.name || "Unknown",
                avatarInitials: post.userId?.name
                  ? post.userId.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "U",
                profilePhoto: post.userId?.profilePhoto || null,
                comments: post.comments?.length || 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
