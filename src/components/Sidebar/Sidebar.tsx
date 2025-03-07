import React, { useState } from 'react';
import './Sidebar.css';

interface SidebarProps {
  onSelectFeature: (feature: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectFeature }) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

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
            没做
          </li>
          <li
              className={selectedFeature === 'feature3' ? 'selected' : ''}
              onClick={() => handleSelectFeature('feature3')}
          >
            没做
          </li>
          <li
              className={selectedFeature === 'feature4' ? 'selected' : ''}
              onClick={() => handleSelectFeature('feature4')}
          >
            没做
          </li>
        </ul>
      </div>
  );
};

export default Sidebar;