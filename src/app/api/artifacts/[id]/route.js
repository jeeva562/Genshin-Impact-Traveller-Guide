import { NextResponse } from 'next/server';
import { getArtifactSetById } from '@/database/repositories/index';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const set = getArtifactSetById(id);

    if (!set) {
      return NextResponse.json(
        { success: false, error: 'Artifact set not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: set });
  } catch (error) {
    console.error('API artifact set detail error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch artifact set' },
      { status: 500 }
    );
  }
}
