import React from 'react';
import { redirect, notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { documentService } from '@/services/document.service';
import { DocumentForm } from '@/components/documents/DocumentForm';

interface EditDocumentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDocumentPage(props: EditDocumentPageProps) {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const { id } = await props.params;
  const document = await documentService.getDocumentById(user.id, id);

  if (!document) {
    notFound();
  }

  return (
    <div className="py-2 sm:py-4">
      <DocumentForm initialData={document} isEditing={true} />
    </div>
  );
}
