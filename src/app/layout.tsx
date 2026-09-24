import type { Metadata } from 'next';
import './globals.css';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSessionUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Life Admin — Citizen Document & Expiry Management System',
  description:
    'Official citizen document vault and statutory expiry management portal adhering to GIGW standards.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#f4f6f9] text-slate-900 antialiased font-sans">
        <TopBar />
        <Header user={user} />
        <Navbar user={user} />
        <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
