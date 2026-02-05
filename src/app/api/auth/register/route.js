import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

    const hashed = bcrypt.hashSync(password, 10);
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashed})
      RETURNING id, name, email
    `;

    return NextResponse.json({ user: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
