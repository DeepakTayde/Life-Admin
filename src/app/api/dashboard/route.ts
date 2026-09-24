import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { dashboardService } from '@/services/dashboard.service';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const summary = await dashboardService.getDashboardSummary(user.id);

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve dashboard metrics' },
      { status: 500 }
    );
  }
}
