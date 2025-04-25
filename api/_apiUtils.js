import { initializeZapt } from '@zapt/zapt-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as Sentry from "@sentry/node";
import { Resend } from 'resend';
import crypto from 'crypto';

// Initialize Sentry
Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

// Initialize Supabase auth
const { supabase } = initializeZapt(process.env.VITE_PUBLIC_APP_ID);

// Initialize database connection
const client = postgres(process.env.COCKROACH_DB_URL);
const db = drizzle(client);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Authenticate user based on JWT token
export async function authenticateUser(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error("Auth error:", error);
      throw new Error('Invalid token');
    }

    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    Sentry.captureException(error);
    throw error;
  }
}

// Generate a random token
export function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Send email via Resend
export async function sendEmail({ to, subject, html }) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Frost Warlord <noreply@resend.dev>',
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Email sending error:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to send email:", error);
    Sentry.captureException(error);
    throw error;
  }
}

// Hash password
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Verify password
export function verifyPassword(password, hash) {
  return crypto.createHash('sha256').update(password).digest('hex') === hash;
}

export { db, Sentry };