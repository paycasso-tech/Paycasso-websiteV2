import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // Example: parse query parameters
    const { searchParams } = new URL(req.url);
    // const param = searchParams.get('param');

    // Example response
    return NextResponse.json({ message: 'GET request received' });
}