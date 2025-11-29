import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'School Onboarding Portal',
  description: 'Onboarding officer portal for school management',
  keywords: ['school', 'onboarding', 'education', 'management'],
  authors: [{ name: 'Your Name' }],
};

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