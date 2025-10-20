
import '../styles/globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'UCR Solar Parts Analysis System',
  description: 'Comprehensive analysis of solar components including manufacturing origin, part weights, and financing options',
  icons: {
    icon: '/ucandr-logo.png',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <header className="bg-gray-100 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center">
                  <Image src="/ucandr-logo.png" alt="Unified Construction and Restoration Logo" width={100} height={100} />
                <h1 className="ml-3 text-xl font-bold text-gray-900">
                  UCR Solar Part Tool
                </h1>
              </Link>
              
                <nav className="flex items-center space-x-6">
                <Link href="/" className="text-gray-600 hover:text-[#053e7f] text-sm font-medium">
                  HOME
                </Link>
                <Link href="/parts-picker" className="text-gray-600 hover:text-[#053e7f] text-sm font-medium">
                  PARTS PICKER
                </Link>
                <Link href="/compare" className="text-gray-600 hover:text-[#053e7f] text-sm font-medium">
                  FINANCING COMPARE
                </Link>
                <Link href="/appointments" className="text-gray-600 hover:text-[#053e7f] text-sm font-medium">
                  SCHEDULE
                </Link>
              </nav>
            </div>
          </div>
        </header>
        {children}

        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-300 font-semibold">
              &copy; {new Date().getFullYear()} Unified Construction and Restoration. All rights reserved.
            </p>
            <a href="mailto:info@ucandr.com" className="text-gray-300 font-semibold text-4xl mx-2 gap-4">
              ✉️
            </a>
            <a href="tel:2402467172" className="text-gray-300 font-semibold text-4xl mx-2">
              📞
            </a>
          </div>
        </footer>
      </body>
    </html>
  )
}
