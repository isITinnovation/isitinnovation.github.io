export interface Tag {
  id: number;
  name: string;
  path: string;
  count?: number;
}

export interface RecentPost {
  id: number;
  title: string;
  path: string;
  date?: string;
}

export const popularTags: Tag[] = [
  { id: 1, name: "개발", path: "/tags/development", count: 128 },
  { id: 2, name: "프론트엔드", path: "/tags/frontend", count: 95 },
  { id: 3, name: "백엔드", path: "/tags/backend", count: 76 },
  { id: 4, name: "React", path: "/tags/react", count: 64 },
  { id: 5, name: "Node.js", path: "/tags/nodejs", count: 52 },
  { id: 6, name: "데이터베이스", path: "/tags/database", count: 48 },
  { id: 7, name: "알고리즘", path: "/tags/algorithm", count: 43 },
  { id: 8, name: "JavaScript", path: "/tags/javascript", count: 38 },
  { id: 9, name: "TypeScript", path: "/tags/typescript", count: 35 },
];

export const recentPosts: RecentPost[] = [
  {
    id: 1,
    title: "Next.js 13 버전 업데이트 소식",
    path: "/posts/nextjs-13-update",
    date: "2024-03-15",
  },
  {
    id: 2,
    title: "React Query 실전 활용법",
    path: "/posts/react-query-guide",
    date: "2024-03-14",
  },
  {
    id: 3,
    title: "TypeScript 타입 시스템 이해하기",
    path: "/posts/typescript-types",
    date: "2024-03-13",
  },
  {
    id: 4,
    title: "웹 성능 최적화 가이드",
    path: "/posts/web-performance",
    date: "2024-03-12",
  },
  {
    id: 5,
    title: "MSW로 효율적인 API 모킹하기",
    path: "/posts/msw-guide",
    date: "2024-03-11",
  },
];
