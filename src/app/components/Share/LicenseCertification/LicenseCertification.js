'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaCertificate } from 'react-icons/fa';

const LicenseCertification = () => {
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    fetch('/certification.json')
      .then((res) => res.json())
      .then((data) => {
        setCertifications(data); // Store all certifications in a single array
      })
      .catch((error) => console.error('Error fetching certification data:', error));
  }, []);

  return (
    <section className="bg-gray-800 py-12 px-4 md:px-8 lg:px-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start px-6 lg:px-20 space-y-12 lg:space-y-0 p-4">

        {/* Left Side - Static Text */}
        <section className="text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-100">License & Certification</h3>
          <p className="mt-4 text-gray-200 text-sm md:text-base">
            Here are my professional certifications that validate my expertise in SEO, Development, Content Creation, and Marketing.
          </p>

          <div className="text-white p-4">
            <h4 className="text-xl font-semibold mb-2">Top Certificates:</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaCertificate className="text-yellow-400 mr-2" />
                Programming Hero
              </li>
              <li className="flex items-center">
                <FaCertificate className="text-yellow-400 mr-2" />
                Google Skills Shop
              </li>
              <li className="flex items-center">
                <FaCertificate className="text-yellow-400 mr-2" />
                Hubspot Academy
              </li>
              <li className="flex items-center">
                <FaCertificate className="text-yellow-400 mr-2" />
                SEMrush
              </li>
              <li className="flex items-center">
                <FaCertificate className="text-yellow-400 mr-2" />
                LinkedIn Content and Creative Design Certification
              </li>
            </ul>
          </div>
        </section>

        {/* Right Side - Auto-Sliding Certifications */}
        <div className="bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg w-full">
          <Swiper
            spaceBetween={10}
            loop={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 1 },
              1024: { slidesPerView: 1 }
            }}
            className="w-full"
          >
            {certifications.map((cert) => (
              <SwiperSlide key={cert._id} className="flex flex-col items-center text-center">
                {/* Responsive Image */}
                <div className="relative w-full max-w-xl mx-auto h-48 md:h-56 lg:h-96">
                  <Image
                    src={cert.img}
                    alt={cert.title}
                    fill
                    className="object-contain rounded-md shadow"
                    priority
                  />
                </div>
                {/* Certification Details */}
                <div className="mt-3">
                  <p className="text-gray-100 font-medium text-sm md:text-base">{cert.title}</p>
                  <p className="text-gray-200 text-xs md:text-sm">Issued by: {cert.issuer}</p>
                  <p className="text-gray-200 text-xs md:text-sm">Credential ID: {cert.c_id}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default LicenseCertification;
