import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(
      'https://school-management-system-indol.vercel.app/api/users/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    console.log('Proxy login response:', data);
    
    const response = NextResponse.json(data, { status: res.status });
    
    // Set the cookie locally if we have a token
    if (data.token) {
      response.cookies.set({
        name: 'token',
        value: data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24,
        sameSite: 'strict',
      });
    }
    
    return response;
  } catch (error) {
    console.error('Proxy login error:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}