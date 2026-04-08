import { NextResponse } from 'next/server';
import { getPhoneNumber } from '@/lib/getPhoneNumber';

export async function GET() {
  try {
    const result = await getPhoneNumber();
    return NextResponse.json(result);
  } catch (error) {
    console.error('[phones API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phone number' },
      { status: 500 }
    );
  }
}
