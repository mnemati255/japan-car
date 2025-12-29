import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch image');
    const arrayBuffer = await response.arrayBuffer();
    const blob = Buffer.from(arrayBuffer);

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'image/jpeg', // یا MIME واقعی تصویر
      },
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
