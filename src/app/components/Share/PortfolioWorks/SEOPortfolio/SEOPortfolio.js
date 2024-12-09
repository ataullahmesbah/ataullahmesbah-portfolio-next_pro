import Image from "next/image";
import SEO from '/public/images/SEO.webp';
import SEO1 from '/public/images/seo/analytics.jpg';

const SEOPortfolio = () => {
    return (
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            {/* Image 1 */}
            <div className="w-full md:w-1/2">
                <Image
                    src={SEO}
                    alt="SEO Portfolio"
                    placeholder="blur"
                    className="rounded-lg w-full h-auto object-cover"
                />
            </div>

            {/* Image 2 */}
            <div className="w-full md:w-1/2">
                <Image
                    src={SEO1}
                    alt="SEO Analytics"
                    placeholder="blur"
                    className="rounded-lg w-full h-auto object-cover"
                />
            </div>
        </div>
    );
};

export default SEOPortfolio;
