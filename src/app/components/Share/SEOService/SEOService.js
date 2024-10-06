'use client';

import { useEffect, useState } from 'react';
import SEOServiceDetails from '../SEOServiceDetails/SEOServiceDetails';

const SEOService = () => {
    const [serviceSections, setServiceSections] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/seoservices.json');
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await res.json();

                // Group services by category
                const groupedServices = data.map(section => ({
                    title: section.category,
                    services: section.services,
                }));

                setServiceSections(groupedServices);
            } catch (error) {
                console.error('Failed to fetch services data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 ">
            {serviceSections.length === 0 ? (
                <p className="text-center text-gray-100 text-lg">Loading...</p>
            ) : (
                serviceSections.map((section) => (
                    <SEOServiceDetails
                        key={section.title}
                        title={section.title}
                        services={section.services}
                    />
                ))
            )}
        </div>
    );
};

export default SEOService;
