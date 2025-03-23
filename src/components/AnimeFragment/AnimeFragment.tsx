import React from 'react';
import './AnimeFragment.css';

interface AnimeFragmentProps {
  imageSrc: string;
  name: string;
  name_cn: string;
}

const AnimeFragment: React.FC<AnimeFragmentProps> = ({ imageSrc, name, name_cn }) => {
  return (
      <div className="AnimeFragment">
        <img src={imageSrc} alt={name} className="anime-image" />
        <div className="anime-banner">
          <h2>{name}</h2>
          <h3>{name_cn}</h3>
        </div>
      </div>
  );
};

export default AnimeFragment;