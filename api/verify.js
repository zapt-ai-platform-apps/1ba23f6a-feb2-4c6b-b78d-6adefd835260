import { db, Sentry } from './_apiUtils.js';
import { users } from '../drizzle/schema.js';
import { eq, and, lt } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log("Verify API called");
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const now = new Date();
    
    // Find user with this token where the token has not expired
    const userToVerify = await db.select()
      .from(users)
      .where(
        and(
          eq(users.verificationToken, token),
          lt(now, users.verificationTokenExpires)
        )
      );
      
    if (userToVerify.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Update user verification status
    await db.update(users)
      .set({ 
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null 
      })
      .where(eq(users.id, userToVerify[0].id));

    console.log("User verified:", userToVerify[0].id);

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error("Verification error:", error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Verification failed' });
  }
}