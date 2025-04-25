import { db, generateToken, sendEmail, hashPassword, Sentry } from './_apiUtils.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log("Register API called");
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !phone || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));
    
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate verification token
    const verificationToken = generateToken();
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token valid for 24 hours

    // Create user
    const hashedPassword = hashPassword(password);
    
    const newUser = await db.insert(users)
      .values({
        name,
        phone,
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        role,
        verificationToken,
        verificationTokenExpires: tokenExpiry
      })
      .returning();

    console.log("User created:", newUser[0].id);

    // Send verification email
    const verificationUrl = `${req.headers.origin}/verify?token=${verificationToken}`;
    
    await sendEmail({
      to: email,
      subject: 'Verifikasi Email Frost Warlord',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0369a1;">Selamat Datang di Frost Warlord!</h2>
          <p>Halo ${name},</p>
          <p>Terima kasih telah mendaftar menjadi anggota tim e-sport Frost Warlord.</p>
          <p>Harap verifikasi email Anda dengan mengklik tombol di bawah ini:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verifikasi Email</a>
          </div>
          <p>Atau salin dan tempel URL ini di browser Anda:</p>
          <p>${verificationUrl}</p>
          <p>Link ini hanya berlaku selama 24 jam.</p>
          <p>Salam,<br>Tim Frost Warlord</p>
        </div>
      `
    });

    return res.status(201).json({ 
      message: 'User registered successfully. Please verify your email.'
    });
  } catch (error) {
    console.error("Registration error:", error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Registration failed' });
  }
}