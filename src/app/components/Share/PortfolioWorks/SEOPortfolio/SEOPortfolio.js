import Image from "next/image";
import SEO from '/public/images/SEO.webp'


const SEOPortfolio = () => {
    return (
        <div>

            <Image
                src={SEO}
                width={800}
                height={800}
                alt="seo portfolio"
                placeholder="blur"
                objectFit="fill"
                className=""

            />


        </div>
    );
};

export default SEOPortfolio;