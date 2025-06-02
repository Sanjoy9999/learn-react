import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";

function AllPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    // Only fetch posts if we have a logged-in user
    if (userData && userData.$id) {
      appwriteService
        .getUserPosts(userData.$id)
        .then((posts) => {
          if (posts && posts.documents) {
            setPosts(posts.documents);
          }
        })
        .catch((error) => {
          console.error("Error fetching user posts:", error);
        })
        .finally(() => setLoading(false));
    } else {
      // If no user is logged in, set posts to empty and stop loading
      setPosts([]);
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold">Loading posts...</h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold">
                You haven't created any posts yet
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div
              key={post.$id}
              className="p-2 w-full md:w-1/2 lg:w-1/3"
            >
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPost;