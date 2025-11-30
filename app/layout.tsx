import type { Metadata } from 'next';
import '@/app/globals.css';

// Metadata
export const metadata: Metadata = {
  title: 'School Onboarding Portal',
  description: 'Onboarding officer portal for school management',
  keywords: ['school', 'onboarding', 'education', 'management'],
  authors: [{ name: 'Your Name' }],
};

// PWAHead component
function PWAHead() {
  return (
    <>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#1e40af" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </>
  );
}

// Root Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}