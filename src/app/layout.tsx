import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSessionUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Life Admin — Document & Renewal Tracker',
  description:
    'Manage your important documents, passport, driving licences, warranties, and insurance renewal dates in one secure place.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50/60 text-slate-900 antialiased font-sans">
        <Navbar user={user} />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
