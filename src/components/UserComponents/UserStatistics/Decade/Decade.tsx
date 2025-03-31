import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { BangumiCollection } from '../types';

const getDecade = (dateString: string): string => {
  const year = new Date(dateString).getFullYear();
  if (year < 1980) return '1980前';
  if (year < 1990) return '1980s';
  if (year < 2000) return '1990s';
  if (year < 2010) return '2000s';
  if (year < 2020) return '2010s';
  return '2020s';
};

const calculateDecadeDistribution = (collections: BangumiCollection[]): Record<string, number> => {
  const distribution: Record<string, number> = {
    '1980前': 0,
    '1980s': 0,
    '1990s': 0,
    '2000s': 0,
    '2010s': 0,
    '2020s': 0,
  };

  collections.forEach(item => {
    const decade = getDecade(item.subject.date);
    distribution[decade]++;
  });

  return distribution;
};

const DecadeRadarChart: React.FC<{ data: BangumiCollection[] }> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const distribution = calculateDecadeDistribution(data);

      const option = {
        title: {
          text: 'Decade Distribution of Collected Works'
        },
        tooltip: {},
        radar: {
          indicator: Object.keys(distribution).map(decade => ({
            name: decade,
            max: Math.max(...Object.values(distribution))
          }))
        },
        series: [{
          name: 'Decade Distribution',
          type: 'radar',
          data: [{
            value: Object.values(distribution),
            name: 'Works'
          }]
        }]
      };

      chart.setOption(option);
    }
  }, [data]);

  return <div ref={chartRef} style={{ width: '600px', height: '400px' }} />;
};

export default DecadeRadarChart;