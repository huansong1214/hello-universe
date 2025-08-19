import type { ReactNode } from 'react';
import 'react-calendar/dist/Calendar.css';

import './globals.css';

import { Header } from '@/components/layout/Header';

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
