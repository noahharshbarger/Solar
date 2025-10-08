import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Solar Parts Analysis System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Analysis of solar parts including manufacturing origin, weights, and pricing. 
            Compare domestic vs foreign content across loan, lease, and PPA structures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/parts-picker"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Parts Analysis
            </Link>
            <Link 
              href="/compare"
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors"
            >
              Financial Comparison
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="text-3xl mb-4">
              🔧
              </div>
            <h3 className="text-xl font-semibold mb-3">
              Parts Lookup
            </h3>
            <p className="text-gray-600">
              Search comprehensive parts database with SKU, brand, type, and pricing information.
            </p>
          </div>
          
          <div className="rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="text-green-600 text-3xl mb-4">
              🌎
              </div>
            <h3 className="text-xl font-semibold mb-3">
              Manufacturing Origin
            </h3>
            <p className="text-gray-600">
              Track where each component is manufactured - domestic vs foreign sourcing analysis.
            </p>
          </div>
          
          <div className="rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="text-3xl mb-4">⚖️</div>
            <h3 className="text-xl font-semibold mb-3">
              Weight Analysis
            </h3>
            <p className="text-gray-600">
              Calculate total system weight and shipping costs based on component specifications.
            </p>
          </div>

          <div className="rounded-xl shadow-lg p-7 border border-gray-100">
            <div className="text-3xl mb-4">
              💳
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Financing Options
            </h3>
            <p className="text-gray-600">
              Compare loan, lease, and PPA structures based on domestic/foreign content percentages.
            </p>
          </div>
        </div>

        <div className="rounded-2xl shadow-lg p-8 border border-gray-100 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">
                Search Parts
                </h4>
              <p className="text-sm text-gray-600">
                Look up components by SKU, brand, or part type
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">
                Check Origin
              </h4>
              <p className="text-sm text-gray-600">
                Verify manufacturing location and domestic content
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">
                Analyze Weight
              </h4>
              <p className="text-sm text-gray-600">
                Calculate shipping and installation requirements (per solar panel)
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-xl font-bold">4</span>
              </div>
              <h4 className="font-semibold mb-2">
                Compare Financing
              </h4>
              <p className="text-sm text-gray-600">
                Evaluate loan/lease/PPA based on content mix
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl shadow-md p-10 border border-gray-200">
          <h2 className="text-3xl font-semibold text-center mb-6">
            Data Structure (JSON)
          </h2>
          <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`{
  "sheetName": "Sheet1",
  "headerStartsAt": "A2",
  "columns": {
    "sku": "Product Number",
    "brand": "Brand",
    "partType": "Part Type",
    "price": "Price",
    "domestic": "Domestic (D) / Foreign (F)",
    "weight": "Weight (lbs)",
    "manufacturer": "Manufacturing Location"
  },
  "priceCurrency": "USD"
}`}
            </pre>
          </div>
          <p className="text-center text-gray-600 mt-4">
            Upload Excel/CSV with this exact sturcture to analyze solar components.
          </p>
        </div>
      </div>
    </main>
  )
}
