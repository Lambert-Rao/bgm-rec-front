import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Home.css';
import Feature1 from '../Feature/SimAni';
import Feature2 from '../Feature/UserPage';
import Feature3 from '../Feature/UserStatitics';
import Feature4 from '../Feature/Info';

const Home: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState<string>('feature1');

  const renderFeature = () => {
    switch (currentFeature) {
      case 'feature1':
        return <Feature1 />;
      case 'feature2':
        return <Feature2 />;
      case 'feature3':
        return <Feature3 />;
      case 'feature4':
        return <Feature4 />;
      default:
        return <Feature1 />;
    }
  };

  return (
      <div className="home">
        <Sidebar onSelectFeature={setCurrentFeature} />
        <div className="content">
          {renderFeature()}
        </div>
      </div>
  );
};

export default Home;