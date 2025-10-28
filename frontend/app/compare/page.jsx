'use client';

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ComparePage() {
  const [projects, setProjects] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [designDetails, setDesignDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  
    useEffect(() => {
      setLoading(true);
      fetch(`${API_BASE_URL}/compare/projects?page=1&per_page=10`)
        .then((res) => res.json())
        .then((data) => {
          setProjects(data.items || []);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load projects");
          setLoading(false);
        });
  }, []);

  useEffect(() => {
    if (!selectedDesign) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/compare/${selectedDesign}`)
      .then((res) => res.json())
      .then((data) => {
        setDesignDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load design details");
        setLoading(false);
      });
  }, [selectedDesign]);

  return (
    <div className="container mx-auto mt-20 p-4 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Compare Projects & Designs</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-4">
        {projects.length === 0 && !loading && <li>No projects found.</li>}
        {projects.map((project) => {
          return (
            <li key={project.project_id} className="border rounded p-4">
              <div className="font-bold text-lg mb-1">{project.project_name}</div>
              <div className="text-sm text-gray-500 mb-2">{project.project_id}</div>
              {project.designs && project.designs.length > 0 && (
                <div>
                  <span className="font-semibold">Designs:</span>
                  <ul className="ml-4 mt-2">
                    {project.designs.map((design) => {
                      return (
                        <li key={design.design_id} className="mb-2">
                          <button
                            className="text-green-700 underline mr-2"
                            onClick={() => setSelectedDesign(design.design_id)}
                          >
                            {design.name}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
//   useEffect(() => {
//     setLoading(true);
//     fetch(`${API_BASE_URL}/compare/projects?page=1&per_page=5&designs_per_project=2`)
//       .then((res) => res.json())
//       .then((data) => {
//         setProjects(data.items || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError("Failed to load projects");
//         setLoading(false);
//       });
//   }, []);

//   // Fetch details for a selected design
//   useEffect(() => {
//     if (!selectedDesign) return;
//     setLoading(true);
//     fetch(`${API_BASE_URL}/compare/${selectedDesign}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setDesignDetails(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError("Failed to load design details");
//         setLoading(false);
//       });
//   }, [selectedDesign]);

//   return (
//     <main className="max-w-4xl mx-auto py-12 px-4">
//       <h1 className="text-3xl font-bold mb-6">Compare Projects & Designs</h1>
//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-600">{error}</p>}
//       <section className="mb-8">
//         <h2 className="text-xl font-semibold mb-2">Projects</h2>
//         {projects.length === 0 && !loading && <p>No projects found.</p>}
//         <ul className="space-y-4">
//           {projects.map((project) => (
//             <li key={project.project_id} className="border rounded p-4">
//               <div className="font-bold text-lg mb-1">{project.project_name}</div>
//               <div className="text-sm text-gray-500 mb-2">Project ID: {project.project_id}</div>
//               <div>
//                 <span className="font-semibold">Designs:</span>
//                 <ul className="ml-4 mt-2">
//                   {project.designs.map((design) => (
//                     <li key={design.design_id} className="mb-2">
//                       <button
//                         className="text-blue-700 underline mr-2"
//                         onClick={() => setSelectedDesign(design.design_id)}
//                       >
//                         {design.name}
//                       </button>
//                       <span className="text-xs text-gray-600">PPW: {design.ppw ?? "N/A"}, Base Price: ${design.base_system_price ?? "N/A"}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="mt-2">
//                 <span className="font-semibold">Totals:</span>
//                 <span className="ml-2 text-green-700">Domestic: ${project.totals?.domestic_total ?? "N/A"}</span>
//                 <span className="ml-2 text-red-700">Non-Domestic: ${project.totals?.non_domestic_total ?? "N/A"}</span>
//                 <span className="ml-2 text-gray-700">Unknown: ${project.totals?.unknown_total ?? "N/A"}</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </section>
//       {designDetails && (
//         <section className="mt-8">
//           <h2 className="text-xl font-semibold mb-2">Design Details</h2>
//           <div className="mb-2">Design ID: {designDetails.design_id}</div>
//           <div className="mb-2">Pricing Method: {designDetails.pricing_method ?? "N/A"}</div>
//           <div className="mb-2">Price Per Watt: {designDetails.ppw ?? "N/A"}</div>
//           <div className="mb-2">Base System Price: ${designDetails.base_system_price ?? "N/A"}</div>
//           <div className="mb-2">Component Count: {designDetails.component_count ?? 0}</div>
//           <div className="mb-2">Incentives: {designDetails.incentives?.length ? designDetails.incentives.join(", ") : "None"}</div>
//           <h3 className="font-semibold mt-4 mb-2">Component Breakdown</h3>
//           <table className="w-full text-sm border">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-2">Name</th>
//                 <th className="p-2">Manufacturer</th>
//                 <th className="p-2">Type</th>
//                 <th className="p-2">Quantity</th>
//                 <th className="p-2">SKU</th>
//                 <th className="p-2">Unit Price</th>
//                 <th className="p-2">Origin</th>
//                 <th className="p-2">Domestic?</th>
//                 <th className="p-2">Line Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {designDetails.items?.map((item, idx) => (
//                 <tr key={idx} className="border-t">
//                   <td className="p-2">{item.name}</td>
//                   <td className="p-2">{item.manufacturer}</td>
//                   <td className="p-2">{item.type}</td>
//                   <td className="p-2">{item.quantity}</td>
//                   <td className="p-2">{item.matched_sku}</td>
//                   <td className="p-2">{item.unit_price ?? "N/A"}</td>
//                   <td className="p-2">{item.origin_country ?? "N/A"}</td>
//                   <td className="p-2">{item.is_domestic ? "Yes" : item.is_domestic === false ? "No" : "Unknown"}</td>
//                   <td className="p-2">{item.line_total ?? "N/A"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className="mt-4">
//             <span className="font-semibold">Totals:</span>
//             <span className="ml-2 text-green-700">Domestic: ${designDetails.summary?.domestic_total ?? "N/A"}</span>
//             <span className="ml-2 text-red-700">Non-Domestic: ${designDetails.summary?.non_domestic_total ?? "N/A"}</span>
//             <span className="ml-2 text-gray-700">Unknown: ${designDetails.summary?.unknown_total ?? "N/A"}</span>
//           </div>
//         </section>
//       )}
//     </main>
//   );
// }