import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';

import ContextProvider from '@/context';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import OCConnectWrapper from '@/components/OCConnectWrapper';

import '../styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Snapture',
  description: 'Smart Contract Service for Construction',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  // Sandbox Mode
  const opts = {
    clientId: 'clientId',
    redirectUri: 'http://localhost:3000/redirect',
    referralCode: 'PARTNER6',
  };

  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ContextProvider cookies={cookies}>
          <OCConnectWrapper opts={opts} sandboxMode={true}>
            {children}
          </OCConnectWrapper>
        </ContextProvider>
        <KeyboardShortcuts />
      </body>
    </html>
  );
}
