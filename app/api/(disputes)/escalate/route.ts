import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // TODO: Handle the escalation logic here

        return NextResponse.json({ message: 'Escalation received', data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}