import '../src/styles/globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Solar Parts Analysis System',
  description: 'Comprehensive analysis of solar components including manufacturing origin, part weights, and financing options',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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
                <Link href="/parts-picker" className="text-gray-600 hover:text-blue-600 font-medium">
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
