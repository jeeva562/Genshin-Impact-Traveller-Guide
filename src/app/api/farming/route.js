import { NextResponse } from 'next/server';
import { getFarmingSchedule } from '@/database/repositories/index';
import { DAYS_OF_WEEK } from '@/lib/constants';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day'); // e.g. 'Monday', 'Tuesday'
    
    // If no day specified or 'today', calculate current server day
    let targetDay = day;
    if (day === 'today' || !day) {
      const todayIndex = new Date().getDay();
      targetDay = DAYS_OF_WEEK[todayIndex];
    } else if (day === 'all') {
      targetDay = null;
    }

    const schedule = getFarmingSchedule(targetDay);

    return NextResponse.json({
      success: true,
      day: targetDay || 'All',
      data: schedule,
      count: schedule.length,
    });
  } catch (error) {
    console.error('API farming error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch farming schedule' },
      { status: 500 }
    );
  }
}
