import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Anime.css';

interface AnimeData {
  name: string;
  name_cn: string;
  images: { small: string, common: string, large: string, grid: string, medium: string };
  rating: { score: number, rank: number };
  meta_tags: string[];
}

interface AnimeProps {
  id: number;
}

const Anime: React.FC<AnimeProps> = ({ id }) => {
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const updateImageSrc = (images: AnimeData['images'], width: number) => {
    if (width < 100) {
      setImageSrc(images.small);
    } else if (width < 200) {
      setImageSrc(images.common);
    } else if (width < 400) {
      setImageSrc(images.medium);
    } else {
      setImageSrc(images.large);
    }
  };

  useEffect(() => {
    axios.get(`https://api.bgm.tv/v0/subjects/${id}`)
    .then(response => {
      setAnimeData(response.data);
      if (containerRef.current) {
        updateImageSrc(response.data.images, containerRef.current.offsetWidth);
      }
    })
    .catch(error => {
      console.error('Error fetching anime data:', error);
    });
  }, [id]);

  useEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]) => {
      if (animeData) {
        const entry = entries[0];
        updateImageSrc(animeData.images, entry.contentRect.width);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [animeData]);

  if (!animeData) {
    return <div>Loading...</div>;
  }

  return (
      <a href={`https://bgm.tv/subject/${id}`} className="anime-link">
        <div className="anime" ref={containerRef}>
          <img src={imageSrc} alt={animeData.name} className="anime-thumbnail" />
          <div className="anime-details">
            <h2>{animeData.name}</h2>
            <h3>{animeData.name_cn}</h3>
            <div className="anime-metatags">
              {animeData.meta_tags.map(meta_tag => (
                  <span key={meta_tag} className="anime-meta-tag">{meta_tag}</span>
              ))}
            </div>
            <div className="anime-rating">
              <p>Score: {animeData.rating.score}</p>
              <div className="spacer"></div>
              <p>Rank: {animeData.rating.rank}</p>
            </div>
          </div>
        </div>
      </a>
  );
};

export default Anime;