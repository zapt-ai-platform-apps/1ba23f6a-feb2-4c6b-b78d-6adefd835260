import { db, verifyPassword, Sentry } from './_apiUtils.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { initializeZapt } from '@zapt/zapt-js';

const { supabase, recordLogin } = initializeZapt(process.env.VITE_PUBLIC_APP_ID);

export default async function handler(req, res) {
  console.log("Login API called");
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const userResult = await db.select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));
    
    if (userResult.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult[0];

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ error: 'Please verify your email before logging in' });
    }

    // Verify password
    if (!verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create a session with Supabase
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Supabase auth error:", error);
      throw error;
    }

    try {
      await recordLogin(email, process.env.VITE_PUBLIC_APP_ENV);
    } catch (error) {
      console.error('Failed to record login:', error);
    }

    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      profilePicture: user.profilePicture
    };

    return res.status(200).json({ 
      message: 'Login successful',
      user: userInfo,
      session
    });
  } catch (error) {
    console.error("Login error:", error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Login failed' });
  }
}