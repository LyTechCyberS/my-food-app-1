import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET all foods
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    
    const foods = await sql`
      SELECT f.*, fc.name as category_name
      FROM foods f
      LEFT JOIN food_categories fc ON f.category_id = fc.id
      WHERE f.user_id = ${decoded.userId}
      ORDER BY f.created_at DESC
    `;
    
    return NextResponse.json(foods);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// POST create food
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    const { name, description, price, category_id } = await request.json();
    
    const result = await sql`
      INSERT INTO foods (name, description, price, category_id, user_id)
      VALUES (${name}, ${description}, ${price}, ${category_id}, ${decoded.userId})
      RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 400 });
  }
}
