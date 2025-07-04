import '../styles/globals.css';
import Header from '@/components/Header/Header';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Hello Universe',
  description: 'Stay curious.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
