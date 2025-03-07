import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './AnimeBanner.css';

interface AnimeData {
  name: string;
  name_cn: string;
  images: { small: string, common: string, large: string, grid: string, medium: string };
  meta_tags: string[];
  summary: string;
}

interface AnimeBannerProps {
  onIdSubmit: (id: number) => void;
}

const AnimeBanner: React.FC<AnimeBannerProps> = ({ onIdSubmit }) => {
  const [id, setId] = useState<number | string>('');
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id !== '') {
      const signalTimeout = setTimeout(() => {
        console.log('External signal with id:', id);
        onIdSubmit(Number(id)); // Call the callback function with the input ID
      }, 1000);

      return () => clearTimeout(signalTimeout);
    }
  }, [id, onIdSubmit]);

  const fetchAnimeData = (animeId: number) => {
    setLoading(true);
    axios.get(`https://api.bgm.tv/v0/subjects/${animeId}`)
    .then(response => {
      setAnimeData(response.data);
      setImageSrc(response.data.images.large);
      setIsVisible(true); // Show the details with fade-in effect
    })
    .catch(error => {
      console.error('Error fetching anime data:', error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    const inputElement = e.target;
    inputElement.style.backgroundColor = '#fff'; // Reset to white immediately
    inputElement.classList.remove('loading'); // Remove transition class
    setIsVisible(false); // Hide the details

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      inputElement.classList.add('loading'); // Add transition class
      inputElement.style.backgroundColor = '#e0f7fa'; // Gradually change to background color

      // Clear previous data before fetching new data
      setAnimeData(null);
      setImageSrc('');

      fetchTimeoutRef.current = setTimeout(() => {
        fetchAnimeData(Number(e.target.value));
      }, 1000);
    }, 1000);
  };

  return (
      <div className={`anime-banner ${isVisible ? 'expanded' : ''}`}>
        <input
            type="text"
            value={id}
            onChange={handleInputChange}
            placeholder="Enter Anime ID"
        />
        {loading && <p>Loading...</p>}
        {animeData && (
            <div className={`anime-banner-details ${isVisible ? 'visible' : ''}`}>
              <img src={imageSrc} alt={animeData.name} className="anime-banner-thumbnail" />
              <div className="anime-banner-info">
                <h2>{animeData.name}</h2>
                <h3>{animeData.name_cn}</h3>
                <div className="anime-banner-metatags">
                  {animeData.meta_tags.map(meta_tag => (
                      <span key={meta_tag} className="anime-banner-meta-tag">{meta_tag}</span>
                  ))}
                </div>
                <p>{animeData.summary}</p>
              </div>
            </div>
        )}
      </div>
  );
};

export default AnimeBanner;