import { db, authenticateUser, Sentry } from './_apiUtils.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log("Profile API called:", req.method);
  
  try {
    // All routes require authentication
    try {
      const user = await authenticateUser(req);
      
      // GET - get user profile
      if (req.method === 'GET') {
        const userData = await db.select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          role: users.role,
          profilePicture: users.profilePicture,
          isAdmin: users.isAdmin,
          createdAt: users.createdAt
        })
        .from(users)
        .where(eq(users.id, user.id));
        
        if (userData.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        return res.status(200).json(userData[0]);
      }
      
      // PUT - update user profile
      if (req.method === 'PUT') {
        const { name, phone, role, profilePicture } = req.body;
        
        if (!name || !phone || !role) {
          return res.status(400).json({ error: 'Required fields cannot be empty' });
        }
        
        const [updatedUser] = await db.update(users)
          .set({ 
            name, 
            phone, 
            role,
            profilePicture: profilePicture || null,
            updatedAt: new Date()
          })
          .where(eq(users.id, user.id))
          .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            phone: users.phone,
            role: users.role,
            profilePicture: users.profilePicture
          });
          
        return res.status(200).json(updatedUser);
      }
      
      return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
      console.error("Profile auth error:", error);
      if (error.message === 'Missing Authorization header' || error.message === 'Invalid token') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      throw error;
    }
  } catch (error) {
    console.error("Profile API error:", error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Server error' });
  }
}