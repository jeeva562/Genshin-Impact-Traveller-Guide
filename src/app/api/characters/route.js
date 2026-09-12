import { NextResponse } from 'next/server';
import { getCharacters } from '@/database/repositories/character-repository';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      vision: searchParams.get('vision'),
      weapon_type: searchParams.get('weapon_type'),
      rarity: searchParams.get('rarity'),
      nation: searchParams.get('nation'),
      search: searchParams.get('search'),
      sort: searchParams.get('sort') || 'name',
      order: searchParams.get('order') || 'asc',
    };

    const characters = getCharacters(filters);
    return NextResponse.json({ characters, count: characters.length });
  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    );
  }
}
