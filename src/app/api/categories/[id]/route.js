import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET single category
export async function GET(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    const { id } = params;

    const categories = await sql`SELECT * FROM food_categories WHERE id = ${id} AND user_id = ${decoded.userId}`;
    const category = categories[0];
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// PUT update category
export async function PUT(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    const { name } = await request.json();
    const { id } = params;

    const result = await sql`
      UPDATE food_categories
      SET name = ${name}
      WHERE id = ${id} AND user_id = ${decoded.userId}
      RETURNING *
    `;
    const updated = result[0];
    if (!updated) return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
  }
}

// DELETE category
export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    const { id } = params;

    await sql`DELETE FROM food_categories WHERE id = ${id} AND user_id = ${decoded.userId}`;

    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 400 });
  }
}
