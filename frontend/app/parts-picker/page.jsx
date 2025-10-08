'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const solarParts = [
  {
    id: 'SPW-400-D',
    name: 'SunPower Maxeon 3 400W',
    brand: 'SunPower',
    partType: 'Solar Panel',
    price: 299,
    domestic: true,
    weight: 42.3,
    manufacturer: 'USA - Oregon',
    efficiency: '22.6%',
    warranty: '25 years'
  },
  {
    id: 'JINKO-350-ND',
    name: 'JinkoSolar Tiger Pro 350W',
    brand: 'JinkoSolar',
    partType: 'Solar Panel',
    price: 189,
    domestic: false,
    weight: 38.7,
    manufacturer: 'China - Jiangxi',
    efficiency: '20.78%',
    warranty: '12 years'
  },
  {
    id: 'SE-5K-D',
    name: 'SolarEdge HD-Wave 5000',
    brand: 'SolarEdge',
    partType: 'Inverter',
    price: 1299,
    domestic: true,
    weight: 28.2,
    manufacturer: 'USA - New Hampshire',
    efficiency: '99%',
    warranty: '12 years'
  },
  {
    id: 'HUAWEI-8K-ND',
    name: 'Huawei SUN2000-8KTL',
    brand: 'Huawei',
    partType: 'Inverter',
    price: 1899,
    domestic: false,
    weight: 26.5,
    manufacturer: 'China - Shenzhen',
    efficiency: '98.4%',
    warranty: '10 years'
  },
  {
    id: 'TESLA-13.5-ND',
    name: 'Tesla Powerwall 2',
    brand: 'Tesla',
    partType: 'Battery',
    price: 7500,
    domestic: false,
    weight: 276,
    manufacturer: 'China - Shanghai',
    capacity: '13.5 kWh',
    warranty: '10 years'
  },
  {
    id: 'ENPHASE-IQ8-D',
    name: 'Enphase IQ8+ Microinverter',
    brand: 'Enphase',
    partType: 'Microinverter',
    price: 149,
    domestic: true,
    weight: 1.5,
    manufacturer: 'USA - California',
    efficiency: '97.5%',
    warranty: '25 years'
  }
]

export default function PartsPicker() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterOrigin, setFilterOrigin] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [parts, setParts] = useState(solarParts)

  const router = useRouter()

  // Teaching: Form state management for adding new parts
  const [newPart, setNewPart] = useState({
    id: '',
    name: '',
    brand: '',
    partType: 'Solar Panel',
    price: '',
    domestic: true,
    weight: '',
    manufacturer: '',
    efficiency: '',
    warranty: ''
  })

  // Simulate data loading with useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewPart(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddPart = (e) => {
    e.preventDefault()

    // Basic validation
    if (!newPart.name || !newPart.brand || !newPart.price || !newPart.id) {
      alert('Please fill in all required fields')
      return
    }

    if (parts.some(part => part.id === newPart.id)) {
      alert('Part ID already exists. Please use a unique ID.')
      return 
    }

    const partToAdd = {
      ...newPart,
      price: parseFloat(newPart.price),
      weight: parseFloat(newPart.weight) || 0
    }

    setParts(prev => [...prev, partToAdd])

    setNewPart({
      id: '',
      name: '',
      brand: '',
      partType: 'Solar Panel',
      price: '',
      domestic: true,
      weight: '',
      manufacturer: '',
      efficiency: '',
      warranty: ''
    })

    setShowAddForm(false)
    alert('Part added successfully!')
  }

  const filteredParts = parts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase())
                          || part.brand.toLowerCase().includes(searchTerm.toLowerCase())
                          || part.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'all' || part.partType === filterType
    const matchesOrigin = filterOrigin === 'all' ||
                          (filterOrigin === 'domestic' && part.domestic) ||
                          (filterOrigin === 'foreign' && !part.domestic)

    return matchesSearch && matchesType && matchesOrigin
  })

    // Loading state  
    if (isLoading) {
      return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading solar parts database...</p>
            </div>
          </div>
        </main>
      )
    }

    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-16">
          <nav className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Link href="/" className="hover:text-blue-600">Home</Link>
                <span>➡️</span>
                <span className="text-gray-900 font-medium">Parts Picker</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/appointments" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  📅 Appointments
                </Link>
                <Link
                  href="/api-demo"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    API Demo
                  </Link>
              </div>
            </div>
          </nav>
          <div className="rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Solar Parts Search
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Compare components with specifications
              </p>
            </div>
            <div className="rounded-xl shadow-lg p-8 border border-gray-100 mb-12">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Parts
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or brand"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Part Type
                      </label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="all">All Types</option>
                          <option value="Solar Panel">Solar Panel</option>
                          <option value="Inverter">Inverter</option>
                          <option value="Battery">Battery</option>
                          <option value="Microinverter">Microinverter</option>
                        </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manufacturing Origin
                  </label>
                  <select
                    value={filterOrigin}
                    onChange={(e) => setFilterOrigin(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Origins</option>
                      <option value="domestic">Domestic Only</option>
                      <option value="foreign">Foreign Only</option>
                    </select>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  {showAddForm ? 'Cancel' : 'Add New Part'}
                </button>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-blue-100 rounded-xl shadow-xl p-8 border-2 border-blue-300 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-blue-900">Add New Part</h3>
              <form onSubmit={handleAddPart} className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Part ID *
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={newPart.id}
                      onChange={handleInputChange}
                      placeholder="e.g., SPW-450-D"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Part Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newPart.name}
                        onChange={handleInputChange}
                        placeholder="e.g., SunPower Maxeon 3 500W"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand *
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={newPart.brand}
                        onChange={handleInputChange}
                        placeholder="e.g., SunPower"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Part Type *
                        </label>
                        <select
                          name="partType"
                          value={newPart.partType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="Solar Panel">Solar Panel</option>
                            <option value="Inverter">Inverter</option>
                            <option value="Battery">Battery</option>
                            <option value="Microinverter">Microinverter</option>
                          </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={newPart.price}
                        onChange={handleInputChange}
                        placeholder='299'
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (lbs)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={newPart.weight}
                        onChange={handleInputChange}
                        placeholder="e.g. 40.0 lbs"
                        min="0"
                        step="0.1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manufacturer Location
                      </label>
                      <input
                        type="text"
                        name="manufacturerLocation"
                        value={newPart.manufacturerLocation}
                        onChange={handleInputChange}
                        placeholder="e.g. San Jose, CA"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Efficiency (%)
                      </label>
                      <input
                        type="text"
                        name="efficiency"
                        value={newPart.efficiency}
                        onChange={handleInputChange}
                        placeholder="e.g. 22.5%"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Warranty
                          </label>
                          <input
                            type="text"
                            name="warranty"
                            value={newPart.warranty}
                            onChange={handleInputChange}
                            placeholder="e.g. 25 years"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newPart.domestic}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Manufactured Domestically
                    </label>
                </div>
                <div className="flex gap-4 items-center">
                  <button
                    type="submit"
                    className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                  >
                    Add Part
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="inline-flex items-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                    >
                      Cancel
                    </button>
                </div>
              </form>
              </div>
          )}
          

          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredParts.length} of {parts.length} Parts
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
          <div className="grid gap-6 mb-12">
            {filteredParts.map((part) => (
              <div 
                key={part.id}
                className="rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{part.name}</h3>
                      <p className="text-sm text-gray-500">{part.id}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      part.domestic
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {part.domestic ? 'Domestic' : 'Foreign'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm-mb-4">
                    <p><span className="font-medium">Brand:</span> {part.brand}</p>
                    <p><span className="font-medium">Type:</span> {part.brand}</p>
                    <p><span className="font-medium">Price:</span> <span className="text-green-600 font-bold">${part.price.toLocaleString()}</span></p>
                    <p><span className="font-medium">Weight:</span> {part.weight} lbs</p>
                    <p><span className="font-medium">Made in:</span> {part.manufacturer}</p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/parts/${part.id}`)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
                        >
                          View Details
                        </button>
                        <Link
                        href="/compare"
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center"
                        >
                          Compare
                        </Link>
                        </div>
                        </div>
                        </div>
            ))}
            </div>

            {filteredParts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No parts found</h3>
                <p className="text-gray-600 mb-4">Try adjusting filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterType('all')
                    setFilterOrigin('all')
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
            )}
          </div>
        </div>
      </main>
    )
    }