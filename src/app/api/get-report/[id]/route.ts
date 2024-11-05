// app/api/get-report/[id]/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(context.params);
    const searchParams = request.nextUrl.searchParams;
    const maxResults = '100';
    const nextCursor = searchParams.get('next_cursor') || '';

    const metadataUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources_last_access_reports/${id}`;
    const metadataResponse = await fetch(metadataUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`
        ).toString('base64')}`,
      },
    });

    if (!metadataResponse.ok) {
      const errorData = await metadataResponse.json();
      return NextResponse.json(
        { error: 'Failed to fetch report metadata', details: errorData },
        { status: metadataResponse.status }
      );
    }

    const metadata = await metadataResponse.json();

    // Verify report age
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const reportDate = new Date(metadata.created_at);

    if (reportDate < sixMonthsAgo) {
      return NextResponse.json(
        {
          error: 'Report too old',
          message:
            'This report is older than 6 months and its assets may no longer be available',
          metadata,
        },
        { status: 400 }
      );
    }

    // Fetch assets
    const assetsUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/last_access_report/${id}`;
    const url = new URL(assetsUrl);
    url.searchParams.set('max_results', maxResults);
    if (nextCursor) {
      url.searchParams.set('next_cursor', nextCursor);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`
        ).toString('base64')}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText };
      }

      return NextResponse.json(
        {
          error: 'Failed to fetch report assets',
          details: errorData,
          metadata,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      ...data,
      metadata,
    });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
