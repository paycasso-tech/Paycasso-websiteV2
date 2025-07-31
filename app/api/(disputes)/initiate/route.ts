import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // TODO: Handle the POST request logic here

        return NextResponse.json({ message: 'Request received', data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}