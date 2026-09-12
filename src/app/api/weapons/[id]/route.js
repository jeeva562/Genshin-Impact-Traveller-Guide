import { NextResponse } from 'next/server';
import { getWeaponById } from '@/database/repositories/index';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const weapon = getWeaponById(id);

    if (!weapon) {
      return NextResponse.json(
        { success: false, error: 'Weapon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: weapon });
  } catch (error) {
    console.error('API weapon detail error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weapon' },
      { status: 500 }
    );
  }
}
