import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { DocumentForm } from '@/components/documents/DocumentForm';

export default async function NewDocumentPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="py-2 sm:py-4">
      <DocumentForm isEditing={false} />
    </div>
  );
}
