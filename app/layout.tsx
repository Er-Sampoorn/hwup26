import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';

export const metadata: Metadata = {
  title: 'FranchiseGuard AI — Multimodal Franchise Compliance Intelligence Platform',
  description: 'Enterprise AI continuous compliance intelligence for franchise networks. Powered natively by RocketRide declarative .pipe pipelines. Zero false accusations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white text-cyber-darkText antialiased flex flex-col selection:bg-black selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
