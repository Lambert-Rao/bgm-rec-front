import { useState, useEffect, JSX } from 'react';
import { UserCollections } from './types';
import { ApiResponse } from './types';

// 24 hours in milliseconds
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

const UserDataFetcher = ({
                           userId,
                           userName,
                           children
                         }: {
  userId?: string;
  userName?: string;
  children: (props: {
    data: UserCollections;
    loading: boolean;
    error: Error | null;
    total: number;
  }) => JSX.Element;
}) => {
  const [data, setData] = useState<UserCollections>({
    doing: [],
    collect: [],
    wish: [],
    onhold: [],
    dropped: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cacheKey = `bgm-rec-lambert-${userId || userName}-all`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
          const { data: cacheData, timestamp } = JSON.parse(cached) as {
            data: UserCollections;
            timestamp: number;
          };
          if (Date.now() - timestamp < CACHE_EXPIRY) {
            setData(cacheData);
            setTotal(Object.values(cacheData).reduce((acc, list) => acc + list.length, 0));
            setLoading(false);
            return;
          }
        }

        const collectionTypes = [1, 2, 3, 4, 5];
        const collectionTypeLabels: Record<number, keyof UserCollections> = {
          1: 'doing',
          2: 'collect',
          3: 'wish',
          4: 'onhold',
          5: 'dropped'
        };
        const groupedData: UserCollections = {
          doing: [],
          collect: [],
          wish: [],
          onhold: [],
          dropped: []
        };

        for (const collectionType of collectionTypes) {
          let offset = 0;
          const limit = 40;
          let hasMore = true;

          while (hasMore) {
            const fetchId = userName || userId || '';
            const url = new URL(
                `https://api.bgm.tv/v0/users/${encodeURIComponent(fetchId)}/collections`
            );

            url.searchParams.append('subject_type', '2');
            url.searchParams.append('type', collectionType.toString());
            url.searchParams.append('limit', limit.toString());
            url.searchParams.append('offset', offset.toString());

            const response = await fetch(url.toString(), {
              headers: {
                'User-Agent': 'bangumi-react-app/1.0'
              }
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const json: ApiResponse = await response.json();
            const labeledData = json.data.map(item => ({
              ...item,
              collectionTypeLabel: collectionTypeLabels[collectionType]
            }));

            groupedData[collectionTypeLabels[collectionType]] = [
              ...groupedData[collectionTypeLabels[collectionType]],
              ...labeledData
            ];

            hasMore = json.data.length >= limit;
            offset += limit;
          }
        }

        localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: groupedData,
              timestamp: Date.now()
            })
        );

        setData(groupedData);
        setTotal(Object.values(groupedData).reduce((acc, list) => acc + list.length, 0));
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, userName]);

  return children({ data, loading, error, total });
};

export default UserDataFetcher;