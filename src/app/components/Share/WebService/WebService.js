// WebService.js


'use client';
import { useEffect, useState } from "react";
import WebServiceDetails from "../WebServiceDetails/WebServiceDetails";

const WebService = () => {
    const [serviceSections, setServiceSections] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/webservices');  // Ensure this matches your API route
                if (!res.ok) throw new Error('Network response was not ok');

                const data = await res.json();
                console.log('Fetched Data:', data);  // Log to inspect the data structure

                const groupedServices = data.map(section => ({
                    title: section.category,
                    services: section.services,
                }));
                console.log('Grouped Sections:', groupedServices);  // Log the grouped data

                setServiceSections(groupedServices);
            } catch (error) {
                console.error('Failed to fetch services data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {serviceSections.length === 0 ? (
                <p className="text-center text-gray-100">Loading...</p>
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
