// AnimeBanner.tsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import './AnimeBanner.css';

interface AnimeData {
  id: number;
  name: string;
  name_cn: string;
  images: { small: string, common: string, large: string, grid: string, medium: string };
  meta_tags: string[];
  summary: string;
}

interface SearchResult {
  id: number;
  name: string;
  name_cn: string;
  image: string;
}

interface SearchResultData {
  id: number;
  name: string;
  name_cn: string;
  images: { large: string };
}

interface AnimeBannerProps {
  onIdSubmit: (id: number) => void; // 修改为只接收数字ID
}

const AnimeBanner: React.FC<AnimeBannerProps> = ({ onIdSubmit }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSearchResults = async (keyword: string) => {
    try {
      const encodedKeyword = encodeURIComponent(keyword);
      const response = await axios.get(
          `https://api.bgm.tv/search/subject/${encodedKeyword}?type=2&responseGroup=small&max_results=12`
      );

      if (response.data.list) {
        const results = response.data.list.map((item: SearchResultData) => ({
          id: item.id,
          name: item.name,
          name_cn: item.name_cn || item.name,
          image: item.images?.large || '',
        }));
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const fetchAnimeData = async (animeId: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.bgm.tv/v0/subjects/${animeId}`);
      const data = response.data;
      setAnimeData({ ...data, id: animeId });
      setIsVisible(true);
      onIdSubmit(animeId); // 提交选中的ID
    } catch (error) {
      console.error('Error fetching anime data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchResults([]);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      // 新增：重置动画信息和可见状态
      setAnimeData(null);
      setIsVisible(false);

      // 处理数字ID输入
      const id = parseInt(value, 10);
      if (!isNaN(id)) {
        await fetchAnimeData(id);
        return;
      }

      // 处理文本搜索
      if (value.trim().length > 0) {
        setLoading(true);
        try {
          await fetchSearchResults(value);
        } finally {
          setLoading(false);
        }
      }
    }, 500);
  };

  const handleSelectResult = async (result: SearchResult) => {
    setInputValue(result.name_cn || result.name);
    setSearchResults([]);
    await fetchAnimeData(result.id);
  };

  return (
      <div className={`anime-banner ${isVisible ? 'expanded' : ''}`}>
        <div className="search-container">
          <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="输入动画ID或名称"
              className="search-input"
          />

          {loading && <div className="loading-indicator">搜索中...</div>}

          {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(result => (
                    <div
                        key={result.id}
                        className="search-result-item"
                        onClick={() => handleSelectResult(result)}
                    >
                      <img src={result.image} alt={result.name_cn} />
                      <div className="result-info">
                        <div className="chinese-name">{result.name_cn}</div>
                        <div className="original-name">{result.name}</div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>

        {animeData && (
            <div className={`anime-banner-details ${isVisible ? 'visible' : ''}`}>
              <img src={animeData.images.large} alt={animeData.name} className="anime-thumbnail" />
              <div className="anime-info">
                <h2>{animeData.name_cn || animeData.name}</h2>
                {animeData.name_cn && <h3>{animeData.name}</h3>}
                <div className="meta-tags">
                  {animeData.meta_tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <p className="summary">{animeData.summary}</p>
              </div>
            </div>
        )}
      </div>
  );
};

export default AnimeBanner;