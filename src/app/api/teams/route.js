import { NextResponse } from 'next/server';
import { getTeamTemplates } from '@/database/repositories/index';

export async function GET(request) {
  try {
    const teams = getTeamTemplates();
    return NextResponse.json({
      success: true,
      data: teams,
      count: teams.length,
    });
  } catch (error) {
    console.error('API teams error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team templates' },
      { status: 500 }
    );
  }
}
