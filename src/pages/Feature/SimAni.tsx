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
              <h1>喜欢该动画的用户也喜欢：</h1>
              <h3>由于深度学习的不可预测性，可能出现莫名其妙的条目，属于正常现象，毕设项目完结前会尽量优化，敬请谅解</h3>
              <AnimeList ids={animeIds} />
            </>
        )}
      </div>
  );
};

export default SimAni;