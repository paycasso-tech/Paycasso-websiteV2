import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        // TODO: Handle the data and upload to IPFS

        return NextResponse.json({ message: 'Upload successful', data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to upload' }, { status: 500 });
    }
}