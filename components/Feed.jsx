'use client';
import { useState, useEffect, useCallback } from 'react';
import PromptCard from './PromptCard';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useDebounce from '@utils/useDebounce';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map(post => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams.get('q');
  const [searchText, setsearchText] = useState(query ? query : '');
  const [posts, setPosts] = useState([]);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      if (!value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams],
  );

  const fetchPosts = useCallback(async () => {
    const response = await fetch('/api/prompt');
    const data = await response.json();
    setPosts(data);
  }, []);

  const debouncedSearchValue = useDebounce(searchText, 1000);

  useEffect(() => {
    console.log('debounce')
    const getFilteredResult = async () => {
      try {
        const response = await fetch(`/api/search?q=${debouncedSearchValue}`);
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.log(err);
      }
    };
    debouncedSearchValue ? getFilteredResult() : fetchPosts();
  }, [debouncedSearchValue]);

  const handleSearchChange = e => {
    setsearchText(e.target.value);
    router.push(`${pathname}?${createQueryString('q', e.target.value)}`);
  };

  const handleTagClick = tag => {
    setsearchText(tag);
    router.push(`${pathname}?${createQueryString('q', tag)}`);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <PromptCardList data={posts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
