import React from 'react';
import './UserStatitics.css';
import UserDataFetcher from '../../components/UserComponents/UserStatistics/UserDataFetcher';
import LoadingSpinner from '../../components/UserComponents/UserStatistics/LoadingSpinner';
import ErrorDisplay from '../../components/UserComponents/UserStatistics/ErrorDisplay';
import DecadeRadarChart from '../../components/UserComponents/UserStatistics/Decade/Decade';

const UserStatitics: React.FC = () => {
  return (
      <div className="UserStatitics">
        <UserDataFetcher userId="kousekiun">
          {({ data, loading, error, total }) => {
            if (loading) return <LoadingSpinner />;
            if (error) return <ErrorDisplay message={error.message} />;

            return (
                <div>
                  <h3>共 {total} 条收藏</h3>
                  <DecadeRadarChart data={data.collect} />
                </div>
            );
          }}
        </UserDataFetcher>
      </div>
  );
};

export default UserStatitics;