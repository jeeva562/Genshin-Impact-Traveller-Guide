import { NextResponse } from 'next/server';
import { getArtifactSets } from '@/database/repositories/index';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || 'name',
    };

    const artifacts = getArtifactSets(filters);
    return NextResponse.json({
      success: true,
      data: artifacts,
      count: artifacts.length,
    });
  } catch (error) {
    console.error('API artifacts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch artifact sets' },
      { status: 500 }
    );
  }
}
