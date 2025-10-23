import { Post } from '@/types/blog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kairoquantum-production.up.railway.app';

export class BlogService {
  /**
   * Fetch all blog posts
   */
  static async getAllPosts(): Promise<Post[]> {
    try {
      // For now, using JSONPlaceholder as demo API
      // Replace with your actual blog API endpoint
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        next: { revalidate: 60 } // Cache for 60 seconds
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const posts = await response.json();
      return posts.slice(0, 20); // Limit to 20 posts
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  /**
   * Fetch a single blog post by ID
   */
  static async getPostById(id: string): Promise<Post | null> {
    try {
      // For now, using JSONPlaceholder as demo API
      // Replace with your actual blog API endpoint
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        next: { revalidate: 60 } // Cache for 60 seconds
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  }

  /**
   * Get static params for static generation
   */
  static async getStaticParams(): Promise<{ id: string }[]> {
    try {
      const posts = await this.getAllPosts();
      return posts.map((post) => ({
        id: String(post.id),
      }));
    } catch (error) {
      console.error('Error generating static params:', error);
      return [];
    }
  }

  /**
   * Search posts by title or content
   */
  static async searchPosts(query: string): Promise<Post[]> {
    try {
      const allPosts = await this.getAllPosts();
      return allPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching posts:', error);
      return [];
    }
  }

  /**
   * Get recent posts (for homepage or sidebar)
   */
  static async getRecentPosts(limit: number = 5): Promise<Post[]> {
    try {
      const allPosts = await this.getAllPosts();
      return allPosts.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      return [];
    }
  }
}