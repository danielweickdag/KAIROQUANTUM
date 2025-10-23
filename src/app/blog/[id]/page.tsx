import { Post, BlogPageProps } from '@/types/blog';
import { BlogService } from '@/services/blogService';

// Next.js will invalidate the cache when a 
// request comes in, at most once every 60 seconds.
export const revalidate = 60;

export async function generateStaticParams() {
  return await BlogService.getStaticParams();
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { id } = await params;
  const post = await BlogService.getPostById(id);
  
  if (!post) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-8 border border-red-500/30">
              <h1 className="text-2xl font-bold mb-4 text-red-400">Post Not Found</h1>
              <p className="text-gray-300">
                The blog post you're looking for doesn't exist or couldn't be loaded.
              </p>
              <a 
                href="/blog" 
                className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Back to Blog
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back to blog link */}
          <div className="mb-8">
            <a 
              href="/blog" 
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Blog
            </a>
          </div>

          {/* Blog post content */}
          <article className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {post.title}
              </h1>
              <div className="flex items-center text-gray-300 text-sm">
                <span>Post ID: {post.id}</span>
              </div>
            </header>

            <div className="prose prose-invert max-w-none">
              <div className="text-lg leading-relaxed text-gray-200">
                {post.content}
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}