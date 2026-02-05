import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET all categories
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    
    const categories = await sql`
      SELECT * FROM food_categories 
      WHERE user_id = ${decoded.userId}
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// POST create category
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    const { name } = await request.json();
    
    const result = await sql`
      INSERT INTO food_categories (name, user_id)
      VALUES (${name}, ${decoded.userId})
      RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 400 });
  }
}
