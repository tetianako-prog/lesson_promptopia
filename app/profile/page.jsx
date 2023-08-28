'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Profile from '@components/Profile';

const MyProflie = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const handleEdit = post => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  const fetchPosts = useCallback(async () => {
    const response = await fetch(`/api/users/${session?.user.id}/posts`);
    const data = await response.json();
    setPosts(data);
  }, []);
  const handleDelete = async post => {
    const isSure = confirm('Are you sure that you want to delete this post?');
    if (!isSure) return;
    try {
      await fetch(`/api/prompt/${post._id}`, {
        method: 'DELETE',
      });
      const filteredPosts = posts.filter(item => item._id !== post._id);
      setPosts(filteredPosts);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (session?.user.id) fetchPosts();
  }, []);
  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProflie;
