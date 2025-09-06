import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const apiResponse = await axios.post('https://api-yeshtery.dev.meetusvr.com/v1/yeshtery/token', {
      email,
      password,
      isEmployee: true,
    });

    const { token, refresh, ...userInfo } = apiResponse.data;

    const cookieStore = await cookies();

    // Set HTTP-only cookie for the token
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    // Optionally set refresh token in another http-only cookie
    cookieStore.set('refresh', refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return NextResponse.json({ success: true, userInfo });
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Login failed';
    return NextResponse.json({ success: false, message }, { status });
  }
}
