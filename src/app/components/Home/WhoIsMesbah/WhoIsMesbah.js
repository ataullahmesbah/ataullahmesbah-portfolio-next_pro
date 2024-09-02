import Image from 'next/image';
import Head from 'next/head';
import SEU from '/public/images/SEU.jpg'

const WhoIsMesbah = () => {
    return (
        <>
            <Head>
                <title>Who is Ataullah Mesbah? | SEO Expert & World Explorer</title>
                <meta name="description" content="Learn about Ataullah Mesbah, an SEO expert and world traveler, who has worked with 100+ companies and clients, and is a proud member of a leading ad agency in Canada." />
                <meta name="keywords" content="Ataullah Mesbah, SEO Expert, World Explorer, Pouvoir en ligne, Web Development, Affiliate Marketing" />
            </Head>

            <section className='bg-blue-50 py-10 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:justify-between gap-10'>

                    {/* Left Side */}
                    <article className='lg:w-1/2 space-y-6'>

                        <header>
                            <div className='flex items-center gap-2 mb-4'>
                                {/* Vertical Border */}
                                <div className=' border-l-4 border-sky-800 h-full min-h-10'></div>
                                <h1 className='text-3xl font-bold'>Who is Ataullah Mesbah?</h1>
                            </div>
                            <h2 className='text-lg font-semibold'>
                                SEO Expert & World Explorer | Global Innovator and Visionary.
                            </h2>
                        </header>

                        <p>
                            Ataullah Mesbah’s journey began in the small village of Shirajpur, where his passion for technology and exploration was first ignited. Graduating from Southeast University, his thirst for knowledge and adventure led him to become a proud member of Pouvoir en ligne, a leading ad agency in Canada located at 60 rue Cartier, St. Lambert, Montreal, QC.
                        </p>
                        <p>
                            With over 100 successful projects for companies and clients across various industries, Ataullah’s expertise spans web development, search engine optimization, and affiliate marketing. His professional prowess is matched only by his love for travel, which has taken him across the globe, discovering new cultures, landscapes, and inspirations along the way.
                        </p>
                        <p>
                            As someone who has both lived in a remote village and thrived in international business, Ataullah Mesbah is a symbol of determination and global perspective, always seeking new horizons.
                        </p>
                    </article>


                    {/* Right Side */}
                    <div className='w-full lg:w-1/2 flex justify-center lg:justify-end'>
                        <div className="border-2 p-3 rounded-md border-gray-600 max-w-xs sm:max-w-sm lg:max-w-md">
                            <Image
                                src={SEU}
                                alt="Ataullah Mesbah"
                                layout="responsive"
                                width={500}
                                height={500}
                                objectFit="cover"
                                className="rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default WhoIsMesbah;
