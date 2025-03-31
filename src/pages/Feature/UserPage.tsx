import React, { useState, useEffect } from 'react';
import './UserPage.css';
import UserBanner from "../../components/UserComponents/UserBanner/UserBanner.tsx";
import AnimeList from "../../components/AnimeComponents/AnimeList/AnimeList.tsx";

const UserPage: React.FC = () => {
  const [animeIds, setAnimeIds] = useState<number[]>([]);
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [isNotUser, setIsNotUser] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnimeIds = async () => {
      try {
        // const response = await fetch(`http://localhost:5000/api/anime/sim/${submittedId}`);
        const response = await fetch(`${window.location.origin}/api/user/rec/${submittedId}`);
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const ids = await response.json();
            setAnimeIds(ids);
            setIsNotUser(false);
          } else {
            const text = await response.text();
            console.error('Unexpected response format:', text);
          }
        } else if (response.status === 404) {
          setIsNotUser(true);
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
      setSubmittedId(id);
  };

  return (
      <div className="UserPage">
        <UserBanner onIdSubmit={handleIdSubmit} />
        {submittedId === null ? (
            <h1>请输入用户ID(用户url中的id)</h1>
        ) : isNotUser ? (
            <h1>无效用户或用户收藏过少，<br/>目前只使用了动画收藏数量大于100<br/>（收集数据时）的用户进行训练</h1>
        ) : (
            <>
              <h1>你的推荐动画：</h1>
              <AnimeList ids={animeIds} />
            </>
        )}
      </div>
  );
};

export default UserPage;