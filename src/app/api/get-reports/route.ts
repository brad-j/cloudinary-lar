// app/api/get-reports/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const maxResults = searchParams.get('max_results') || '100';
    const nextCursor = searchParams.get('next_cursor') || '';

    const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources_last_access_reports`;
    const apiUrl = new URL(url);
    apiUrl.searchParams.set('max_results', maxResults);
    if (nextCursor) {
      apiUrl.searchParams.set('next_cursor', nextCursor);
    }

    const response = await fetch(apiUrl.toString(), {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`
        ).toString('base64')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Cloudinary API request failed', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const filteredReports = data.reports.filter(
      (report: { created_at: string | number | Date }) =>
        new Date(report.created_at) >= sixMonthsAgo
    );

    return NextResponse.json({
      reports: filteredReports,
      next_cursor: data.next_cursor,
    });
  } catch (error) {
    console.error('Error in route handler:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
