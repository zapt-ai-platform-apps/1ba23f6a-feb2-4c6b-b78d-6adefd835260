import { db, authenticateUser, Sentry } from './_apiUtils.js';
import { posts } from '../drizzle/schema.js';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log("Posts API called:", req.method);
  
  try {
    // GET - fetch all posts or a specific post
    if (req.method === 'GET') {
      const { slug } = req.query;
      
      // If slug is provided, fetch a specific post
      if (slug) {
        const post = await db.select()
          .from(posts)
          .where(eq(posts.slug, slug));
          
        if (post.length === 0) {
          return res.status(404).json({ error: 'Post not found' });
        }
        
        // Increment view count
        await db.update(posts)
          .set({ viewCount: post[0].viewCount + 1 })
          .where(eq(posts.id, post[0].id));
          
        return res.status(200).json(post[0]);
      }
      
      // Otherwise, fetch all posts
      const allPosts = await db.select()
        .from(posts)
        .where(eq(posts.isPublished, true))
        .orderBy(desc(posts.createdAt));
        
      return res.status(200).json(allPosts);
    }
    
    // POST - create a new post (requires authentication)
    if (req.method === 'POST') {
      try {
        const user = await authenticateUser(req);
        const { title, content, imageUrl, slug } = req.body;
        
        if (!title || !content || !slug) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if slug is already in use
        const existingPost = await db.select()
          .from(posts)
          .where(eq(posts.slug, slug));
          
        if (existingPost.length > 0) {
          return res.status(400).json({ error: 'Slug already in use' });
        }
        
        const [newPost] = await db.insert(posts)
          .values({
            title,
            content,
            imageUrl,
            authorId: user.id,
            slug
          })
          .returning();
          
        return res.status(201).json(newPost);
      } catch (error) {
        console.error("Error creating post:", error);
        if (error.message === 'Missing Authorization header' || error.message === 'Invalid token') {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        throw error;
      }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error("Posts API error:", error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Server error' });
  }
}