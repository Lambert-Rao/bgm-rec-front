import React, { useState, useEffect } from 'react';
import './SimAni.css';
import AnimeList from '../../components/AnimeList/AnimeList';
import AnimeBanner from '../../components/AnimeBanner/AnimeBanner';

const SimAni: React.FC = () => {
  const [animeIds, setAnimeIds] = useState<number[]>([]);
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [isNotAnime, setIsNotAnime] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnimeIds = async () => {
      try {
        // const response = await fetch(`http://localhost:5000/api/anime/sim/${submittedId}`);
        const response = await fetch(`${window.location.origin}/api/anime/sim/${submittedId}`);
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const ids = await response.json();
            setAnimeIds(ids);
            setIsNotAnime(false);
          } else {
            const text = await response.text();
            console.error('Unexpected response format:', text);
          }
        } else if (response.status === 404) {
          setIsNotAnime(true);
          setAnimeIds([]);
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error connecting to the server:', error);
      }
    };

    if (submittedId !== null) {
      fetchAnimeIds();
    }
  }, [submittedId]);

  const handleIdSubmit = (id: number) => {
    if (!isNaN(id)) {
      setSubmittedId(id);
    } else {
      console.error('Submitted ID is not a number');
    }
  };

  return (
      <div className="simAni">
        <AnimeBanner onIdSubmit={handleIdSubmit} />
        {submittedId === null ? (
            <h1>请输入动画ID</h1>
        ) : isNotAnime ? (
            <h1>并非动画</h1>
        ) : (
            <>
              <h1>喜欢该动画的用户也喜欢：</h1>
              <AnimeList ids={animeIds} />
            </>
        )}
      </div>
  );
};

export default SimAni;