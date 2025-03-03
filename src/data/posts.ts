import { PostDetail } from "../types/post";

export const POSTS_DETAIL: PostDetail[] = [
  {
    id: 1,
    title: "ChatGPT 최신 업데이트",
    views: 1200,
    excerpt: "ChatGPT의 최신 기능과 업데이트 소식을 알아보세요.",
    category: "인공지능",
    content: "여기에 포스트의 전체 내용이 들어갑니다...",
    createdAt: "2024-01-15",
    author: "John Doe",
  },
  {
    id: 2,
    title: "2024년 IT 트렌드",
    views: 980,
    excerpt: "2024년 주목해야 할 IT 업계의 주요 트렌드를 소개합니다.",
    category: "트렌드",
    content: "여기에 포스트의 전체 내용이 들어갑니다...",
    createdAt: "2024-01-15",
    author: "Jane Doe",
  },
  {
    id: 3,
    title: "인공지능 개발 현황",
    views: 850,
    excerpt: "최신 AI 개발 동향과 주요 기술 발전 현황을 알아봅니다.",
    category: "개발",
    content: "여기에 포스트의 전체 내용이 들어갑니다...",
    createdAt: "2024-01-15",
    author: "John Doe",
  },
  {
    id: 3,
    title: "인공지능 개발 현황",
    views: 850,
    excerpt: "최신 AI 개발 동향과 주요 기술 발전 현황을 알아봅니다.",
    category: "개발",
    content: "여기에 포스트의 전체 내용이 들어갑니다...",
    createdAt: "2024-01-15",
    author: "John Doe",
  },
  {
    id: 4,
    title: "인공지능 개발 현황",
    views: 850,
    excerpt: "최신 AI 개발 동향과 주요 기술 발전 현황을 알아봅니다.",
    category: "개발",
    content: "여기에 포스트의 전체 내용이 들어갑니다...",
    createdAt: "2024-01-15",
    author: "John Doe",
  },
  {
    id: 5,
    title: "인공지능 개발 현황",
    views: 850,
    excerpt: "최신 AI 개발 동향과 주요 기술 발전 현황을 알아봅니다.",
    category: "개발",
    content: "여기에 포스트의 전체 내용이 들어갑니다...",
    createdAt: "2024-01-15",
    author: "John Doe",
  },
  {
    id: 6,
    title: "인공지능 개발 현황",
    views: 850,
    excerpt: "최신 AI 개발 동향과 주요 기술 발전 현황을 알아봅니다.",
    category: "개발",
    content: "여기에 포스트의 전체 내용이 들어갑니다...",
    createdAt: "2024-01-15",
    author: "John Doe",
  },
];

export const TRENDING_POSTS = POSTS_DETAIL.map(
  ({ id, title, views, excerpt, category }) => ({
    id,
    title,
    views,
    excerpt,
    category,
  })
);
