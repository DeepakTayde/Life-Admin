import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { documentService } from '@/services/document.service';
import { DocumentsClient } from '@/components/documents/DocumentsClient';
import { documentFilterSchema } from '@/lib/validations/document';

interface DocumentsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function DocumentsPage(props: DocumentsPageProps) {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const rawParams = await props.searchParams;
  const filterResult = documentFilterSchema.safeParse(rawParams);
  const filters = filterResult.success ? filterResult.data : {};

  const documents = await documentService.getDocuments(user.id, filters);

  return <DocumentsClient initialDocuments={documents} />;
}
