import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Juridica Digest | Scholarly Legal Reporter & Case Citator',
  description:
    'An authoritative legal digest powered by high-precision legal AI synthesizing headnotes, ratios, and statutory citations in ScienceDirect scholarly style.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-[#FDFCFB]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
