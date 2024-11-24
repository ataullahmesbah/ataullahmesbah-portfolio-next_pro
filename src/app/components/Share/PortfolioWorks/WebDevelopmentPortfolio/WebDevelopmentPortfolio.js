import Image from "next/image";


const projects = [
    {
        id: 1,
        image: "",
        title: "E-Commerce Platform",
        description:
            "A fully functional e-commerce platform with payment gateway integration and user-friendly design.",
        link: "/projects/e-commerce-platform",
    },
    {
        id: 2,
        image: "",
        title: "Portfolio Website",
        description:
            "A sleek and modern portfolio website showcasing skills and projects effectively.",
        link: "/projects/portfolio-website",
    },
    {
        id: 3,
        image: "",
        title: "Blog Application",
        description:
            "A dynamic blog application with user authentication and admin panel for content management.",
        link: "/projects/blog-application",
    },
];

const WebDevelopmentPortfolio = () => {
    return (
        <section className="py-10 bg-gray-800 rounded">
            {/* Title Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <h1 className="text-4xl font-bold text-white">Web Development Portfolio</h1>
                <p className="text-lg text-gray-200 mt-2">
                    Explore some of the amazing projects I’ve worked on as a web developer.
                </p>
            </div>

            {/* Project Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-gray-700 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <Image
                            src={project.image}
                            alt={project.title}
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-gray-100">{project.title}</h3>
                            <p className="text-gray-200 mt-2">{project.description}</p>
                            <a
                                href={project.link}
                                className="text-blue-500 hover:underline mt-4 inline-block"
                            >
                                See More..
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WebDevelopmentPortfolio;
