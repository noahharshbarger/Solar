import '../styles/globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'

// Next.js Font Optimization
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

// Next.js Metadata API
export const metadata = {
  title: 'Solar Parts Analysis System',
  description: 'Comprehensive analysis of solar components including manufacturing origin, part weights, and financing options',
  keywords: 'solar panels, inverters, domestic manufacturing, clean energy',
  openGraph: {
    title: 'Solar Parts Analysis System',
    description: 'Compare domestic vs foreign solar components',
    type: 'website',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className}`}>
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">☀️</span>
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-900">
                  Solar Part Mapper
                </h1>
              </Link>
              
                <nav className="flex items-center space-x-6">
                <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
                  Home
                </Link>
                <Link href="/calculator" className="text-gray-600 hover:text-blue-600 font-medium">
                  Parts Picker
                </Link>
                <Link href="/compare" className="text-gray-600 hover:text-blue-600 font-medium">
                  Financing Compare
                </Link>
                <Link href="/appointments" className="text-gray-600 hover:text-blue-600 font-medium">
                  Schedule
                </Link>
              </nav>
            </div>
          </div>
        </header>
        {children}

        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-300 font-semibold">
              ERA Solution / VetBoss LLC || 2025
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
