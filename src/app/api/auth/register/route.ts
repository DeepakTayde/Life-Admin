import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signSessionToken, getSessionCookieOptions } from '@/lib/auth';
import { registerSchema } from '@/lib/validations/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid registration details',
          errors: formattedErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, name } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists (case-insensitive)
    const existing = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'An account with this email already exists',
        },
        { status: 409 }
      );
    }

    // Hash password & create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Create session token & cookie
    const token = await signSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account registered successfully',
        data: { user },
      },
      { status: 201 }
    );

    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
  } catch (error: unknown) {
    console.error('Registration error:', error);

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
        message: 'An unexpected error occurred during registration',
      },
      { status: 500 }
    );
  }
}
