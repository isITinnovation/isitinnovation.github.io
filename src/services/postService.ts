import { Post, PostDetail } from "../types/post";
import { TRENDING_POSTS, POSTS_DETAIL } from "../data/posts";

export const postService = {
  // 현재는 정적 데이터를 반환하지만, 추후 API 호출로 대체될 함수들
  getTrendingPosts: async (): Promise<Post[]> => {
    // TODO: API 구현 시 실제 API 호출로 대체
    return Promise.resolve(TRENDING_POSTS);
  },

  getPostById: async (id: number): Promise<PostDetail | undefined> => {
    // TODO: API 구현 시 실제 API 호출로 대체
    return Promise.resolve(POSTS_DETAIL.find((post) => post.id === id));
  },
};
