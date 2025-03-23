import React, {useEffect, useState} from 'react';
import './Info.css';

interface UserInfo {
  avatar: {
    large: string;
    medium: string;
    small: string;
  };
  sign: string;
  url: string;
  username: string;
  nickname: string;
  id: number;
  user_group: number;
}

const Info: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetch('https://api.bgm.tv/v0/users/lambert')
    .then(response => response.json())
    .then(data => setUserInfo(data))
    .catch(error => console.error('Error fetching user info:', error));
  }, []);

  return (
      <div className="info-container">
        <div className="info">
          <h2>项目简介</h2>
          <p>这是一我的毕设项目，出于个人兴趣开发，并非专业研究。本项目目前基于LightGCN进行开发和改进，属于离线学习模型，因此数据更新会不及时，目前数据获取时间为：2025年2月。本模型生成的结果为预计算完毕上传云端数据库，因此用户个性化推荐为固定数据（我会不定时更新），出于成本和稳定性考虑，该项目可能仅包含少量在线计算部分（因为没钱买服务器，该项目部署在serveless在线托管平台）。</p>

          <h2>关于作者</h2>
          <p>我是一个即将毕业和就职的本科毕业生，非计算机专业，兴趣使然制作该系统。</p>

          {userInfo && (
              <>
                <h2>作者信息</h2>
                <div className="author-info">
                  <img src={userInfo.avatar.large} alt="Avatar" className="avatar"/>
                  <div className="author-details">
                    <p>{userInfo.nickname}</p>
                    <p>{userInfo.sign}</p>
                  </div>
                </div>
                <p>
                  <a href={userInfo.url} target="_blank">Bangumi</a>
                  <span className="separator">|</span>
                  <a href="https://github.com/Lambert-Rao" target="_blank">Github</a>
                  <span className="separator">|</span>
                  <a href="mailto://lambertrao@outlook.com" target="_blank">Email</a>
                </p>
              </>
          )}
        </div>
      </div>
  );
};

export default Info;