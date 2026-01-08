import { CONFIG } from '@/global-config';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query');
  const locale = request.nextUrl.searchParams.get('locale');
  const url = `${CONFIG.serverUrl}/car/report-pdf?${query}`;

  try {
    const response = await fetch(url!, {
      headers: {
        'X-Locale': locale!,
      },
    });
    if (!response) throw new Error('Failed to download pdf');
    const arrayBuffer = await response.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
