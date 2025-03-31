// 核心数据结构
export interface BangumiCollection {
  subject_id: number;
  rate: number;
  updated_at: string;
  subject: {
    id: number;
    name: string;
    name_cn: string;
    date: string;
    score: number;
    tags: { name: string,count:number }[];
    eps: number;
    type: number; // 1=书籍 2=动画 3=音乐等
    rank: number;
  };
  ep_status: number; // 已看集数
}

// BangumiCollection的集合
export interface UserCollections {
  doing: BangumiCollection[];
  collect: BangumiCollection[];
  wish: BangumiCollection[];
  onhold: BangumiCollection[];
  dropped: BangumiCollection[];
}

// API响应结构
export interface ApiResponse {
  data: BangumiCollection[];
  total: number;
  limit: number;
  offset: number;
}

