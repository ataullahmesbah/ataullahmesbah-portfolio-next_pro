// WebServiceDetails.js

import Image from 'next/image';

const WebServiceDetails = ({ title, services }) => (
  <section className="py-12 px-2">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-100 mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center bg-gray-800 border-e-purple-600 border-e-4 shadow-md hover:shadow-2xl rounded-lg p-6 transition-transform transform hover:scale-105 duration-1000"
          >
            <div className="md:w-1/2 flex flex-col items-start pr-6">
              <h3 className="text-2xl font-semibold text-gray-100 mb-2">{service.name}</h3>
              <p className="text-gray-200 mb-4">{service.description}</p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Image
                src={service.image}
                alt={service.name}
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WebServiceDetails;
