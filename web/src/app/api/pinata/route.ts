import { NextResponse } from 'next/server';
import { pinata } from '@/pinata';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const url = await pinata.upload.public.createSignedURL({
      expires: 30,
    });
    return NextResponse.json({ url: url }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ text: 'Error creating API Key:' }, { status: 500 });
  }
}
