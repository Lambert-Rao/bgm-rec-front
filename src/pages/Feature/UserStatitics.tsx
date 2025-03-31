import React, { useState } from 'react';
import './UserStatitics.css';
import UserBanner from '../../components/UserComponents/UserBanner/UserBanner.tsx';
import UserDataFetcher from '../../components/UserComponents/UserStatistics/UserDataFetcher';
import LoadingSpinner from '../../components/UserComponents/UserStatistics/LoadingSpinner';
import ErrorDisplay from '../../components/UserComponents/UserStatistics/ErrorDisplay';
import DecadeRadarChart from '../../components/UserComponents/UserStatistics/Decade/Decade';

const UserStatitics: React.FC = () => {
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [isNotUser, setIsNotUser] = useState<boolean>(false);

  const handleIdSubmit = () => {
    // 从localStorage获取用户输入的原始字符串ID
    const userInputId = localStorage.getItem('userInputId');
    if (userInputId) {
      setSubmittedId(userInputId);
      setIsNotUser(false);
    } else {
      setIsNotUser(true);
    }
  };

  return (
      <div className="UserStatitics">
        <UserBanner onIdSubmit={handleIdSubmit} />

        {submittedId === null ? (
            <h1>请输入用户ID(用户url中的id)</h1>
        ) : isNotUser ? (
            <h1>
              无效用户或用户收藏过少，<br/>
              目前只使用了动画收藏数量大于100<br/>
              （收集数据时）的用户进行训练
            </h1>
        ) : (
            <UserDataFetcher userId={submittedId}>
              {({ data, loading, error, total }) => {
                if (loading) return <LoadingSpinner />;
                if (error) {
                  if (error.message.includes('404')) {
                    setIsNotUser(true);
                    return <div />; // Return an empty div instead of null
                  }
                  return <ErrorDisplay message={error.message} />;
                }

                return (
                    <div>
                      <h3>共 {total} 条收藏</h3>
                      <DecadeRadarChart data={data.collect} />
                    </div>
                );
              }}
            </UserDataFetcher>
        )}
      </div>
  );
};

export default UserStatitics;