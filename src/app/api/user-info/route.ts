import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const userInfoResponse = await axios.get('https://api-yeshtery.dev.meetusvr.com/v1/user/info', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({ success: true, userInfo: userInfoResponse.data });
  } catch (error: unknown) {
    console.error('Error fetching user info:', error);
    let message = 'Failed to fetch user info';
    let status = 500;

    if (axios.isAxiosError(error) && error.response) {
      status = error.response.status;
      message = error.response.data?.message || message;
    }

    return NextResponse.json({ success: false, message }, { status });
  }
}
