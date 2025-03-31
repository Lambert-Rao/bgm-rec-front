import React, { useState, useEffect } from 'react';
import './Sidebar.css';

interface SidebarProps {
  onSelectFeature: (feature: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectFeature }) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>('feature1');

  useEffect(() => {
    onSelectFeature('feature1');
  }, [onSelectFeature]);

  const handleSelectFeature = (feature: string) => {
    setSelectedFeature(feature);
    onSelectFeature(feature);
  };

  return (
      <div className="sidebar">
        <ul>
          <li
              className={selectedFeature === 'feature1' ? 'selected' : ''}
              onClick={() => handleSelectFeature('feature1')}
          >
            相似动画
          </li>
          <li
              className={selectedFeature === 'feature2' ? 'selected' : ''}
              onClick={() => handleSelectFeature('feature2')}
          >
            用户个性化推荐
          </li>
          <li
              className={selectedFeature === 'feature3' ? 'selected' : ''}
              onClick={() => handleSelectFeature('feature3')}
          >
            统计图
          </li>
          <li
              className={selectedFeature === 'feature4' ? 'selected' : ''}
              onClick={() => handleSelectFeature('feature4')}
          >
            相关信息
          </li>
        </ul>
      </div>
  );
};

export default Sidebar;