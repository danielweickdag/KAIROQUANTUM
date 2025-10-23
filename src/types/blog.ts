export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  excerpt?: string;
  tags?: string[];
  published?: boolean;
}

export interface BlogParams {
  id: string;
}

export interface BlogPageProps {
  params: Promise<BlogParams>;
}