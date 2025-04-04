import React, { useState, useEffect } from 'react';
import './SimAni.css';
import AnimeBanner from "../../components/AnimeComponents/AnimeBanner/AnimeBanner.tsx";
import AnimeList from "../../components/AnimeComponents/AnimeList/AnimeList.tsx";

const SimAni: React.FC = () => {
  const [animeIds, setAnimeIds] = useState<number[]>([]);
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [isNotAnime, setIsNotAnime] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnimeIds = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/anime/sim/${submittedId}`);

        if (response.ok) {
          const ids = await response.json();
          setAnimeIds(ids);
          setIsNotAnime(false);
        } else if (response.status === 404) {
          setIsNotAnime(true);
          setAnimeIds([]);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (submittedId !== null) {
      fetchAnimeIds();
    }
  }, [submittedId]);

  const handleIdSubmit = (id: number) => {
    if (!isNaN(id)) {
      setSubmittedId(id);
    }
  };

  return (
      <div className="simAni">
        <AnimeBanner onIdSubmit={handleIdSubmit} />

        {submittedId === null ? (
            <h1>请输入动画ID或名称进行搜索</h1>
        ) : isNotAnime ? (
            <h1>并非动画</h1>
        ) : (
            <>
              <h1>根据用户收藏、staff列表、标签计算得出的相似动画：</h1>
              <AnimeList ids={animeIds} />
            </>
        )}
      </div>
  );
};

export default SimAni;