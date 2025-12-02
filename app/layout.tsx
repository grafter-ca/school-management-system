// app/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "School Onboarding Portal",
  description: "Onboarding officer portal for school management",
  keywords: ["school", "onboarding", "education", "management"],
  authors: [{ name: "Your Name" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

function PWAHead() {
  return (
    <>
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <link rel="mask-icon" href="/icons/safari-pinned-tab.webp" color="#1e40af" />
    </>
  );
}

export function generateViewport(){
  return{
    themeColor: "#1e40af",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA extra tags */}
        <PWAHead />
      </head>

      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
