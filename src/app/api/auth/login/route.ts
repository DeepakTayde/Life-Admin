import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signSessionToken, getSessionCookieOptions } from '@/lib/auth';
import { loginSchema } from '@/lib/validations/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide both email and password',
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Find user (case-insensitive)
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Create session token & cookie
    const token = await signSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
      },
      { status: 200 }
    );

    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);

    const err = error as { code?: string; name?: string; message?: string };
    const errMessage = err?.message || '';
    const isDbError =
      err?.code === 'P1001' ||
      err?.code === 'P1000' ||
      err?.code === 'P2021' ||
      err?.name === 'PrismaClientInitializationError' ||
      errMessage.includes("Can't reach database server") ||
      errMessage.includes('does not exist in the current database') ||
      errMessage.includes('DATABASE_URL');

    if (isDbError) {
      const isMissingTables = err?.code === 'P2021' || errMessage.includes('does not exist');
      return NextResponse.json(
        {
          success: false,
          message: isMissingTables
            ? 'Database tables are not initialized. Please run "npx prisma db push" to create tables.'
            : 'Database connection failed. Please ensure DATABASE_URL is properly configured in Vercel Environment Variables and points to a cloud PostgreSQL database.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred during login',
      },
      { status: 500 }
    );
  }
}
