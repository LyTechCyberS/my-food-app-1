import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// PUT update food
export async function PUT(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    const { name, description, price, category_id } = await request.json();
    const { id } = params;
    
    const result = await sql`
      UPDATE foods 
      SET name = ${name}, description = ${description}, 
          price = ${price}, category_id = ${category_id}
      WHERE id = ${id} AND user_id = ${decoded.userId}
      RETURNING *
    `;
    
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
  }
}

// DELETE food
export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    const { id } = params;
    
    await sql`
      DELETE FROM foods 
      WHERE id = ${id} AND user_id = ${decoded.userId}
    `;
    
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 400 });
  }
}
