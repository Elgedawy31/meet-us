import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    cookieStore.delete('refresh');

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error: unknown) {
    console.error('Error during logout:', error);
    let message = 'Logout failed';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
