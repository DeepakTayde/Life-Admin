import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { documentService } from '@/services/document.service';
import { documentCreateSchema, documentFilterSchema } from '@/lib/validations/document';

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'You must be logged in to view documents',
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawFilter = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
    };

    const filterResult = documentFilterSchema.safeParse(rawFilter);
    const filters = filterResult.success ? filterResult.data : {};

    const documents = await documentService.getDocuments(user.id, filters);

    return NextResponse.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve documents',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'You must be logged in to create a document',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = documentCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid document information provided',
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const newDocument = await documentService.createDocument(user.id, result.data);

    return NextResponse.json(
      {
        success: true,
        message: 'Document created successfully',
        data: newDocument,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create document',
      },
      { status: 500 }
    );
  }
}
