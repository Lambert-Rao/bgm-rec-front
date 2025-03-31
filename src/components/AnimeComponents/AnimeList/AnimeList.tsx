import React from 'react';
import Anime from '../Anime/Anime';
import './AnimeList.css';

interface AnimeListProps {
  ids: number[];
}

const AnimeList: React.FC<AnimeListProps> = ({ ids }) => {
  return (
      <div className="anime-list">
        {ids.map(id => (
            <Anime key={id} id={id} />
        ))}
      </div>
  );
};

export default AnimeList;