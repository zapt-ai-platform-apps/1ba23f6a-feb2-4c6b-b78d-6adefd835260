import { db, authenticateUser, Sentry } from './_apiUtils.js';
import { comments, users } from '../drizzle/schema.js';
import { eq, asc } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log("Comments API called:", req.method);
  
  try {
    // GET - get comments for a post
    if (req.method === 'GET') {
      const { postId } = req.query;
      
      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }
      
      // Get comments with user info
      const commentsWithUsers = await db
        .select({
          id: comments.id,
          content: comments.content,
          postId: comments.postId,
          createdAt: comments.createdAt,
          userId: comments.userId,
          userName: users.name,
          userProfilePicture: users.profilePicture
        })
        .from(comments)
        .innerJoin(users, eq(comments.userId, users.id))
        .where(eq(comments.postId, postId))
        .orderBy(asc(comments.createdAt));
        
      return res.status(200).json(commentsWithUsers);
    }
    
    // POST - add a new comment (requires authentication)
    if (req.method === 'POST') {
      try {
        const user = await authenticateUser(req);
        const { postId, content } = req.body;
        
        if (!postId || !content) {
          return res.status(400).json({ error: 'Post ID and content are required' });
        }
        
        const [newComment] = await db.insert(comments)
          .values({
            content,
            postId,
            userId: user.id
          })
          .returning();
          
        // Get user info to return with the comment
        const userData = await db
          .select({
            id: users.id,
            name: users.name,
            profilePicture: users.profilePicture
          })
          .from(users)
          .where(eq(users.id, user.id));
        
        const commentWithUser = {
          ...newComment,
          userName: userData[0].name,
          userProfilePicture: userData[0].profilePicture
        };
        
        return res.status(201).json(commentWithUser);
      } catch (error) {
        console.error("Error creating comment:", error);
        if (error.message === 'Missing Authorization header' || error.message === 'Invalid token') {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        throw error;
      }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error("Comments API error:", error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Server error' });
  }
}