
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
                <Link href="/search-parts" className="text-gray-600 hover:text-[#053e7f] text-sm font-medium">
                  SEARCH PARTS
                </Link>
                <Link href="/compare" className="text-gray-600 hover:text-[#053e7f] text-sm font-medium">
                  FINANCING COMPARE
                </Link>
                {/* <Link href="/appointments" className="text-gray-600 hover:text-[#053e7f] text-sm font-medium">
                  SCHEDULE
                </Link> */}
                <Link href="/projects" className="text-gray-600 hover:text-[#053e7f] text-sm font-medium">
                  PROJECTS
                </Link>
                <Link href="/project-archives" className="text-gray-600 hover:text-[#053e7f] text-sm font-medium">
                  PROJECT ARCHIVES
                </Link>
                <Link href="/feoc-calculator" className="text-gray-600 hover:text-[#053e7f] text-sm font-medium">
                  FEOC CALCULATOR
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
            <div className="border rounded border-gray-300 background-gray-100 font-semibold mt-4 pt-2 pb-2 px-4 inline-block">
            <a href="mailto:info@ucandr.com" className="text-white font-semibold">
              Contact Support
            </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
