import { db, authenticateUser, Sentry } from './_apiUtils.js';
import { uploads } from '../drizzle/schema.js';
import { desc } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log("Uploads API called:", req.method);
  
  try {
    // GET - fetch all uploads
    if (req.method === 'GET') {
      const allUploads = await db.select()
        .from(uploads)
        .orderBy(desc(uploads.createdAt));
        
      return res.status(200).json(allUploads);
    }
    
    // POST - create a new upload (requires authentication)
    if (req.method === 'POST') {
      try {
        const user = await authenticateUser(req);
        const { title, description, fileUrl, thumbnailUrl, uploadType, sizeBytes } = req.body;
        
        if (!title || !fileUrl || !uploadType || !sizeBytes) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const [newUpload] = await db.insert(uploads)
          .values({
            title,
            description,
            fileUrl,
            thumbnailUrl,
            uploadedBy: user.id,
            uploadType,
            sizeBytes
          })
          .returning();
          
        return res.status(201).json(newUpload);
      } catch (error) {
        console.error("Error creating upload:", error);
        if (error.message === 'Missing Authorization header' || error.message === 'Invalid token') {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        throw error;
      }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error("Uploads API error:", error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Server error' });
  }
}