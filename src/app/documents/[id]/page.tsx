import React from 'react';
import { redirect, notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { documentService } from '@/services/document.service';
import { DocumentDetailView } from '@/components/documents/DocumentDetailView';

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentDetailPage(props: DocumentDetailPageProps) {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const { id } = await props.params;
  const document = await documentService.getDocumentById(user.id, id);

  if (!document) {
    notFound();
  }

  return <DocumentDetailView document={document} />;
}
