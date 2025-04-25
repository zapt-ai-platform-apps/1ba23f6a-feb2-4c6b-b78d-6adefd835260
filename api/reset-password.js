import { db, hashPassword, Sentry } from './_apiUtils.js';
import { users } from '../drizzle/schema.js';
import { eq, and, lt } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log("Reset Password API called");
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    const now = new Date();
    
    // Find user with this reset token where the token has not expired
    const userToReset = await db.select()
      .from(users)
      .where(
        and(
          eq(users.resetToken, token),
          lt(now, users.resetTokenExpires)
        )
      );
      
    if (userToReset.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update user password
    const hashedPassword = hashPassword(password);
    
    await db.update(users)
      .set({ 
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpires: null 
      })
      .where(eq(users.id, userToReset[0].id));

    console.log("Password reset for user:", userToReset[0].id);

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error("Reset password error:", error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Password reset failed' });
  }
}