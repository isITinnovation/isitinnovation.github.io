export interface Post {
  id: number;
  title: string;
  views: number;
  excerpt: string;
  category: string;
}

export interface PostDetail extends Post {
  content: string;
  createdAt: string;
  author: string;
}
