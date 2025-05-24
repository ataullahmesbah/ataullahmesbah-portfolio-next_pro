'use client';

import { useEffect, useState } from "react";
import WebServiceDetails from "../WebServiceDetails/WebServiceDetails";


const WebService = () => {
  const [serviceSections, setServiceSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/services/web-development', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch services');

        const data = await res.json();
        console.log('Fetched Data:', data);

        const groupedServices = data.map(section => ({
          title: section.category,
          services: section.services,
        }));
        console.log('Grouped Sections:', groupedServices);

        setServiceSections(groupedServices);
      } catch (error) {
        console.error('Failed to fetch services data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      {loading ? (
        <p className="text-center text-gray-100">Loading...</p>
      ) : serviceSections.length === 0 ? (
        <p className="text-center text-gray-100">No services available.</p>
      ) : (
        serviceSections.map((section) => (
          <WebServiceDetails
            key={section.title}
            title={section.title}
            services={section.services}
          />
        ))
      )}
    </div>
  );
};

export default WebService;