'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

import Profile from '@components/Profile';

const MyProflie = () => {
   const { id } = useParams();
   const searchParams = useSearchParams();
   const name = searchParams.get('name');
   const [posts, setPosts] = useState([]);
 
  const fetchPosts = useCallback(async () => {
    const response = await fetch(`/api/users/${id}/posts`);
    const data = await response.json();
    setPosts(data);
  }, []);
  
  useEffect(() => {
    if (id) fetchPosts();
  }, []);
  return (
    <Profile
      name={name}
      desc={`This is a page of ${name}`}
      data={posts}
    />
  );
};

export default MyProflie;
