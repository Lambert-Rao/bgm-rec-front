import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './UserBanner.css';

interface UserData {
  sign: string;
  url: string;
  id: number;
  avatar: { small: string, large: string, medium: string };
  username: string;
  nickname: string;
}

interface UserProps {
  onIdSubmit: (id: number) => void;
}

const UserBanner: React.FC<UserProps> = ({ onIdSubmit }) => {
  const [id, setId] = useState<number | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id !== null) {
      const signalTimeout = setTimeout(() => {
        console.log('External signal with id:', id);
        onIdSubmit(id); // Call the callback function with the input ID
      }, 1000);

      return () => clearTimeout(signalTimeout);
    }
  }, [id, onIdSubmit]);

  const fetchUserData = (userIdInput: string) => {
    setLoading(true);
    axios.get(`https://api.bgm.tv/v0/users/${userIdInput}`)
    .then(response => {
      setUserData(response.data);
      setId(response.data.id);
      setImageSrc(response.data.avatar.large);
      setIsVisible(true); // Show the details with fade-in effect
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setUserData(null);
      setImageSrc('');

      fetchTimeoutRef.current = setTimeout(() => {
        fetchUserData(e.target.value);
      }, 1000);
    }, 1000);
  };

  return (
      <div className={`user-banner ${isVisible ? 'expanded' : ''}`}>
        <input
            type="text"
            onChange={handleInputChange}
            placeholder="Enter User ID"
        />
        {loading && <p>Loading...</p>}
        {userData && (
            <div className={`user-banner-details ${isVisible ? 'visible' : ''}`}>
              <img src={imageSrc} alt={userData.nickname} className="user-banner-thumbnail" />
              <div className="user-banner-info">
                <h2>{userData.nickname}</h2>
                <h3>{userData.sign}</h3>
                <p>用户总结与统计正在制作中</p>
              </div>
            </div>
        )}
      </div>
  );
};

export default UserBanner;