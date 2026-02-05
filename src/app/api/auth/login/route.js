import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const users = await sql`SELECT id, name, email, password FROM users WHERE email = ${email}`;
    const user = users[0];
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET);
    delete user.password;
    return NextResponse.json({ token, user }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    // Return a helpful message during development. Change to a generic message in production.
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
