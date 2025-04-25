import { db, authenticateUser, Sentry } from './_apiUtils.js';
import { matches } from '../drizzle/schema.js';
import { desc } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log("Matches API called:", req.method);
  
  try {
    // GET - fetch all matches
    if (req.method === 'GET') {
      const allMatches = await db.select()
        .from(matches)
        .orderBy(desc(matches.matchDate));
        
      return res.status(200).json(allMatches);
    }
    
    // POST - record a new match (requires authentication)
    if (req.method === 'POST') {
      try {
        const user = await authenticateUser(req);
        const { opponent, matchDate, matchResult, ourScore, opponentScore, notes } = req.body;
        
        if (!opponent || !matchDate) {
          return res.status(400).json({ error: 'Opponent and match date are required' });
        }
        
        const [newMatch] = await db.insert(matches)
          .values({
            opponent,
            matchDate: new Date(matchDate),
            matchResult: matchResult || null,
            ourScore: ourScore || null,
            opponentScore: opponentScore || null,
            notes: notes || null,
            recordedBy: user.id
          })
          .returning();
          
        return res.status(201).json(newMatch);
      } catch (error) {
        console.error("Error recording match:", error);
        if (error.message === 'Missing Authorization header' || error.message === 'Invalid token') {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        throw error;
      }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error("Matches API error:", error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Server error' });
  }
}