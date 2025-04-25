import { db, generateToken, sendEmail, Sentry } from './_apiUtils.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log("Forgot Password API called");
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const userResult = await db.select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));
    
    if (userResult.length === 0) {
      // Don't reveal if email exists or not (security best practice)
      return res.status(200).json({ message: 'If your email is registered, you will receive a password reset link' });
    }

    const user = userResult[0];

    // Generate reset token
    const resetToken = generateToken();
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1); // Token valid for 1 hour

    // Update user with reset token
    await db.update(users)
      .set({ 
        resetToken,
        resetTokenExpires: tokenExpiry 
      })
      .where(eq(users.id, user.id));

    // Send password reset email
    const resetUrl = `${req.headers.origin}/reset-password?token=${resetToken}`;
    
    await sendEmail({
      to: email,
      subject: 'Reset Password Frost Warlord',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0369a1;">Reset Password</h2>
          <p>Halo ${user.name},</p>
          <p>Anda telah meminta untuk mengatur ulang password akun Frost Warlord Anda.</p>
          <p>Silakan klik tombol di bawah ini untuk mengatur ulang password Anda:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>Atau salin dan tempel URL ini di browser Anda:</p>
          <p>${resetUrl}</p>
          <p>Link ini hanya berlaku selama 1 jam.</p>
          <p>Jika Anda tidak meminta reset password, harap abaikan email ini.</p>
          <p>Salam,<br>Tim Frost Warlord</p>
        </div>
      `
    });

    return res.status(200).json({ 
      message: 'If your email is registered, you will receive a password reset link'
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}