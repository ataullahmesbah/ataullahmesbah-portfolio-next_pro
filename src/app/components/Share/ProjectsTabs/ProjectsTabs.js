'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RiArrowRightDoubleLine } from 'react-icons/ri';

// Metadata for SEO (App Router); comment out if using Pages Router
export const metadata = {
  title: 'Projects Preview | Ataullah Mesbah',
  description: 'A preview of our portfolio projects',
};

// Simple cache to store fetched projects
const cache = new Map();

const ProjectsTabs = ({ projects: initialProjects = null }) => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const retryCount = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    if (initialProjects) {
      setProjects(initialProjects.slice(0, 3));
      return;
    }

    const fetchProjects = async () => {
      if (cache.has('projects')) {
        setProjects(cache.get('projects'));
        return;
      }

      try {
        const response = await fetch('/api/projects', {
          next: { revalidate: 3600 },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid API response: Expected an array');
        }

        const sortedProjects = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        cache.set('projects', sortedProjects);
        setProjects(sortedProjects);
      } catch (err) {
        console.error('Error fetching projects:', {
          message: err.message,
          stack: err.stack,
          retryCount: retryCount.current,
        });

        if (retryCount.current < maxRetries) {
          retryCount.current += 1;
          console.log(`Retrying fetch... Attempt ${retryCount.current}`);
          setTimeout(fetchProjects, 1000 * retryCount.current);
        } else {
          setError('Failed to load projects. Please try again later.');
        }
      }
    };

    fetchProjects();
  }, [initialProjects]);

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg text-center max-w-md mx-auto mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 poppins-regular">
      {/* Use <Head> if Pages Router; uncomment if needed */}
      {/* <Head>
        <title>Projects Preview | Ataullah Mesbah</title>
        <meta name="description" content="A preview of our portfolio projects" />
      </Head> */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-10 text-center">
          Project Highlights
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="group bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:shadow-lg"
            >
              {/* Project Image with 16:9 aspect ratio */}
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={project.mainImage}
                  alt={project.imageAlt || project.title}
                  fill
                  className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              {/* Project Details */}
              <div className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-sm font-semibold text-white line-clamp-1">
                    {project.title}
                  </h2>
                  <span className="px-2 py-1 bg-purple-900/50 text-purple-100 rounded-full text-xs">
                    {project.category}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                  {project.description}
                </p>
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors"
                >
                  View Project
                  <RiArrowRightDoubleLine className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
          >
            Explore All Projects
            <RiArrowRightDoubleLine className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTabs;