import { NextResponse } from 'next/server';
import { getWeapons } from '@/database/repositories/index';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      type: searchParams.get('type') || undefined,
      rarity: searchParams.get('rarity') || undefined,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || 'name',
      order: searchParams.get('order') || 'asc',
    };

    const weapons = getWeapons(filters);
    return NextResponse.json({
      success: true,
      data: weapons,
      count: weapons.length,
    });
  } catch (error) {
    console.error('API weapons error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weapons' },
      { status: 500 }
    );
  }
}
