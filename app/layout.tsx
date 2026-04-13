import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Learn Controlling',
  description: 'Lern-App für Controlling',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <div className="flex-grow">
          {children}
        </div>
        <footer className="border-t border-zinc-100 py-8 px-6 md:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
            <p>© {new Date().getFullYear()} Learn Controlling. Alle Rechte vorbehalten.</p>
            <nav className="flex gap-6">
              <Link href="" className="hover:text-zinc-900 transition-colors">
                Impressum
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  )
}
