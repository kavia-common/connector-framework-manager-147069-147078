import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connector Framework Manager",
  description: "Manage connectors, connections, and OAuth integrations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-blue-500/10 to-gray-50 text-gray-900" suppressHydrationWarning>
        <header className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-base font-semibold text-blue-700 hover:text-blue-800">
              Connector Framework Manager
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/" className="text-gray-700 hover:text-gray-900">Connectors</Link>
              <Link href="/connections" className="text-gray-700 hover:text-gray-900">Connections</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
