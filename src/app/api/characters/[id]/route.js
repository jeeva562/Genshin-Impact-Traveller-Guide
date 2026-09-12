import { NextResponse } from 'next/server';
import { getCharacterById } from '@/database/repositories/character-repository';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const character = getCharacterById(id);

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error('Error fetching character:', error);
    return NextResponse.json(
      { error: 'Failed to fetch character' },
      { status: 500 }
    );
  }
}
