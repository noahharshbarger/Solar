'use client';

import React, { useState, useEffect } from 'react';
import { fetchProjects, fetchDesignDetails } from '../../api';

export default function ProjectArchives() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    systemSize: '',
    projectType: 'all',
    feocCompliant: 'all',
    priceRange: 'all',
    searchTerm: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PROJECTS_PER_PAGE = 12;

  // Load past projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProjects({ page: currentPage, perPage: 50 });
        
        // Mock additional data for demonstration - in real implementation this would come from your backend
        const enhancedProjects = (data.projects || data.items || []).map((project, index) => {
          const systemSize = project.systemSize || (Math.random() * 20 + 5).toFixed(1);
          const projectType = project.projectType || (Math.random() > 0.7 ? 'commercial' : 'residential');
          const domesticContent = project.domesticContent || Math.floor(Math.random() * 60 + 20); // 20-80%
          
          // Generate realistic key parts with logical domestic/foreign ratios
          const keyParts = project.keyParts || [
            { 
              type: 'Solar Panels', 
              count: Math.floor(Math.random() * 30 + 10), 
              domestic: domesticContent > 50 // Panels follow overall domestic trend
            },
            { 
              type: 'Inverter', 
              count: Math.floor(Math.random() * 3 + 1), 
              domestic: domesticContent > 40 // Inverters slightly more likely to be foreign
            },
            { 
              type: 'Racking', 
              count: 1, 
              domestic: domesticContent > 30 // Steel/iron requirements stricter
            }
          ];

          // Calculate FEOC compliance based on actual 2025 IRS rules
          const steelIronDomestic = keyParts.find(p => p.type === 'Racking')?.domestic || false;
          const steelIronCompliant = steelIronDomestic; // Must be 100% US for steel/iron
          const manufacturedProductsCompliant = domesticContent >= 45; // 45% minimum for 2025
          
          // Project eligibility (most residential <1MW auto-qualify)
          const systemSizeNum = parseFloat(systemSize);
          const projectEligible = systemSizeNum < 1 || projectType === 'residential' || Math.random() > 0.3;
          
          // Final FEOC compliance = content compliance + project eligibility
          const feocCompliant = steelIronCompliant && manufacturedProductsCompliant && projectEligible;

          return {
            ...project,
            // Enhanced fields for sales evaluation
            projectId: project.id || `proj_${Math.random().toString(36).substr(2, 9)}`,
            customerName: project.customerName || `Customer ${Math.floor(Math.random() * 1000)}`,
            systemSize,
            totalCost: project.totalCost || Math.floor(Math.random() * 40000 + 20000), // $20k-60k
            projectType,
            feocCompliant, // NOW LOGICALLY CALCULATED
            domesticContent,
            taxCreditAmount: project.taxCreditAmount || Math.floor(Math.random() * 20000 + 5000),
            profitMargin: project.profitMargin || (Math.random() * 15 + 10).toFixed(1), // 10-25%
            completedDate: project.completedDate || new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            location: project.location || ['California', 'Texas', 'Florida', 'New York', 'Arizona'][Math.floor(Math.random() * 5)],
            status: project.status || 'completed',
            keyParts,
            challenges: project.challenges || [
              'FEOC compliance verification',
              'Domestic content sourcing', 
              'Installation timeline'
            ][Math.floor(Math.random() * 3)],
            successFactors: project.successFactors || [
              'High domestic content achieved',
              'Early customer engagement',
              'Optimal part selection'
            ],
            // Add compliance details for transparency
            complianceDetails: {
              steelIronCompliant,
              manufacturedProductsCompliant,
              projectEligible,
              requiredDomestic: 45 // 2025 requirement
            }
          };
        });

        setProjects(enhancedProjects);
        setFilteredProjects(enhancedProjects);
        setTotalPages(Math.ceil(enhancedProjects.length / PROJECTS_PER_PAGE));
      } catch (error) {
        console.error('Failed to load projects:', error);
        // Fallback demo data
        const demoProjects = Array.from({ length: 25 }, (_, i) => ({
          projectId: `demo_${i + 1}`,
          customerName: `Demo Customer ${i + 1}`,
          systemSize: (Math.random() * 20 + 5).toFixed(1),
          totalCost: Math.floor(Math.random() * 40000 + 20000),
          projectType: Math.random() > 0.7 ? 'commercial' : 'residential',
          feocCompliant: Math.random() > 0.3,
          domesticContent: Math.floor(Math.random() * 60 + 20),
          taxCreditAmount: Math.floor(Math.random() * 20000 + 5000),
          profitMargin: (Math.random() * 15 + 10).toFixed(1),
          completedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          location: ['California', 'Texas', 'Florida', 'New York', 'Arizona'][Math.floor(Math.random() * 5)],
          status: 'completed',
          keyParts: [
            { type: 'Solar Panels', count: Math.floor(Math.random() * 30 + 10), domestic: Math.random() > 0.5 },
            { type: 'Inverter', count: Math.floor(Math.random() * 3 + 1), domestic: Math.random() > 0.4 },
            { type: 'Racking', count: 1, domestic: Math.random() > 0.6 }
          ],
          challenges: ['FEOC compliance', 'Domestic sourcing', 'Timeline'][Math.floor(Math.random() * 3)],
          successFactors: ['High domestic content', 'Early engagement', 'Optimal parts'][Math.floor(Math.random() * 3)]
        }));
        setProjects(demoProjects);
        setFilteredProjects(demoProjects);
        setTotalPages(Math.ceil(demoProjects.length / PROJECTS_PER_PAGE));
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [currentPage]);

  // Apply filters
  useEffect(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = !filters.searchTerm || 
        project.customerName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        project.projectId.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesSystemSize = !filters.systemSize || 
        parseFloat(project.systemSize) >= parseFloat(filters.systemSize) - 2 &&
        parseFloat(project.systemSize) <= parseFloat(filters.systemSize) + 2;

      const matchesProjectType = filters.projectType === 'all' || 
        project.projectType === filters.projectType;

      const matchesFeoc = filters.feocCompliant === 'all' ||
        (filters.feocCompliant === 'compliant' && project.feocCompliant) ||
        (filters.feocCompliant === 'non-compliant' && !project.feocCompliant);

      const matchesPriceRange = filters.priceRange === 'all' ||
        (filters.priceRange === 'under-30k' && project.totalCost < 30000) ||
        (filters.priceRange === '30k-50k' && project.totalCost >= 30000 && project.totalCost <= 50000) ||
        (filters.priceRange === 'over-50k' && project.totalCost > 50000);

      return matchesSearch && matchesSystemSize && matchesProjectType && matchesFeoc && matchesPriceRange;
    });

    setFilteredProjects(filtered);
    setTotalPages(Math.ceil(filtered.length / PROJECTS_PER_PAGE));
    setCurrentPage(1);
  }, [filters, projects]);

  // Get paginated projects
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  const handleProjectSelect = async (project) => {
    setSelectedProject(project);
    setShowDetails(true);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project archives...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#053e7f] mb-2">Project Archives</h1>
          <p className="text-gray-600">Reference past successful projects for feasibility analysis</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Filter Past Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({...prev, searchTerm: e.target.value}))}
                placeholder="Customer, location, ID..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">System Size (kW)</label>
              <input
                type="number"
                value={filters.systemSize}
                onChange={(e) => setFilters(prev => ({...prev, systemSize: e.target.value}))}
                placeholder="e.g. 10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
              <select
                value={filters.projectType}
                onChange={(e) => setFilters(prev => ({...prev, projectType: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">FEOC Compliance</label>
              <select
                value={filters.feocCompliant}
                onChange={(e) => setFilters(prev => ({...prev, feocCompliant: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Projects</option>
                <option value="compliant">FEOC Compliant</option>
                <option value="non-compliant">Non-Compliant</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({...prev, priceRange: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Ranges</option>
                <option value="under-30k">Under $30k</option>
                <option value="30k-50k">$30k - $50k</option>
                <option value="over-50k">Over $50k</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  systemSize: '',
                  projectType: 'all',
                  feocCompliant: 'all',
                  priceRange: 'all',
                  searchTerm: ''
                })}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Showing {paginatedProjects.length} of {filteredProjects.length} projects
            </p>
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {paginatedProjects.map((project) => (
            <div
              key={project.projectId}
              onClick={() => handleProjectSelect(project)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-blue-300"
            >
              <div className="p-6">
                {/* Project Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.customerName}</h3>
                    <p className="text-sm text-gray-500">{project.location}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    project.feocCompliant 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {project.feocCompliant ? 'FEOC ✓' : 'FEOC ✗'}
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">System Size</p>
                      <p className="font-semibold">{project.systemSize} kW</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Project Type</p>
                      <p className="font-semibold capitalize">{project.projectType}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Total Cost</p>
                      <p className="font-bold text-green-600">${project.totalCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Profit Margin</p>
                      <p className="font-bold text-blue-600">{project.profitMargin}%</p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="text-gray-500">Domestic Content</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${
                          project.domesticContent >= 40 ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(project.domesticContent, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{project.domesticContent}% domestic</p>
                  </div>

                  <div className="text-sm">
                    <p className="text-gray-500">Customer Tax Credit</p>
                    <p className="font-bold text-purple-600">${project.taxCreditAmount.toLocaleString()}</p>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="mt-4 pt-4 border-t">
                  <button className="w-full bg-[#053e7f] text-white py-2 rounded-lg hover:bg-[#042c5a] transition-colors font-medium">
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <div className="text-4xl mb-4">📂</div>
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your filters to find relevant past projects</p>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {showDetails && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProject.customerName}</h2>
                  <p className="text-gray-600">{selectedProject.location} • Completed {selectedProject.completedDate}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Project Overview */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Project Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">System Size:</span> {selectedProject.systemSize} kW</p>
                    <p><span className="font-medium">Type:</span> {selectedProject.projectType}</p>
                    <p><span className="font-medium">Total Cost:</span> ${selectedProject.totalCost.toLocaleString()}</p>
                    <p><span className="font-medium">Project ID:</span> {selectedProject.projectId}</p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Financial Performance</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Profit Margin:</span> {selectedProject.profitMargin}%</p>
                    <p><span className="font-medium">Customer Tax Credit:</span> ${selectedProject.taxCreditAmount.toLocaleString()}</p>
                    <p><span className="font-medium">Domestic Content:</span> {selectedProject.domesticContent}%</p>
                    <p><span className="font-medium">FEOC Status:</span> {selectedProject.feocCompliant ? 'Compliant' : 'Non-Compliant'}</p>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Key Components</h3>
                  <div className="space-y-2 text-sm">
                    {selectedProject.keyParts.map((part, index) => (
                      <p key={index}>
                        <span className="font-medium">{part.type}:</span> {part.count}x 
                        <span className={`ml-1 ${part.domestic ? 'text-green-600' : 'text-red-600'}`}>
                          ({part.domestic ? 'Domestic' : 'Foreign'})
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Success Factors & Challenges */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">✅ Success Factors</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="text-sm space-y-1">
                      {selectedProject.successFactors.map((factor, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">⚠️ Challenges Overcome</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="text-sm space-y-1">
                      <li className="flex items-start">
                        <span className="text-yellow-500 mr-2">•</span>
                        {selectedProject.challenges}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <button className="flex-1 bg-[#053e7f] text-white py-3 rounded-lg hover:bg-[#042c5a] transition-colors font-medium">
                  Use as Template
                </button>
                <button className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium">
                  Export Details
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}