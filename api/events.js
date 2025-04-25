import { db, authenticateUser, Sentry } from './_apiUtils.js';
import { events } from '../drizzle/schema.js';
import { eq, gte } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log("Events API called:", req.method);
  
  try {
    // GET - get all upcoming events
    if (req.method === 'GET') {
      const now = new Date();
      const upcomingEvents = await db.select()
        .from(events)
        .where(gte(events.startTime, now))
        .orderBy(events.startTime);
        
      return res.status(200).json(upcomingEvents);
    }
    
    // POST - create a new event (requires authentication)
    if (req.method === 'POST') {
      try {
        const user = await authenticateUser(req);
        const { title, description, startTime, endTime, eventType, isPublic } = req.body;
        
        if (!title || !startTime || !endTime || !eventType) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const [newEvent] = await db.insert(events)
          .values({
            title,
            description,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            createdBy: user.id,
            eventType,
            isPublic: isPublic ?? true
          })
          .returning();
          
        return res.status(201).json(newEvent);
      } catch (error) {
        console.error("Error creating event:", error);
        if (error.message === 'Missing Authorization header' || error.message === 'Invalid token') {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        throw error;
      }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error("Events API error:", error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Server error' });
  }
}