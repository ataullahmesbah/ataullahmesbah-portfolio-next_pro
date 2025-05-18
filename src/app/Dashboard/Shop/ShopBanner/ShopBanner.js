'use client';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Slider settings
const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    fade: true,
    pauseOnHover: true,
};

const ShopBanner = () => {
    return (
        <div className="w-full h-[50vh] overflow-hidden">
            <Slider {...settings}>
                {/* Slide 1: Books */}
                <div className="relative w-full h-[50vh]">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-800 flex items-center justify-center"
                        style={{
                            backgroundImage: `url('https://via.placeholder.com/1200x600?text=Books')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="text-center text-white px-4 sm:px-8 max-w-3xl mx-auto">
                            <h2 className="text-2xl sm:text-4xl font-extrabold mb-2 sm:mb-4 animate-fade-in">
                                Discover Amazing Books
                            </h2>
                            <p className="text-sm sm:text-lg mb-4 sm:mb-6 animate-slide-up">
                                Explore our curated collection of bestsellers and classics.
                            </p>
                            <a
                                href="/shop/books"
                                className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition transform hover:scale-105 text-sm sm:text-base"
                            >
                                Shop Books
                            </a>
                        </div>
                    </div>
                </div>

                {/* Slide 2: eBooks */}
                <div className="relative w-full h-[50vh]">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-900 to-cyan-800 flex items-center justify-center"
                        style={{
                            backgroundImage: `url('https://via.placeholder.com/1200x600?text=eBooks')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="text-center text-white px-4 sm:px-8 max-w-3xl mx-auto">
                            <h2 className="text-2xl sm:text-4xl font-extrabold mb-2 sm:mb-4 animate-fade-in">
                                Instant eBooks Access
                            </h2>
                            <p className="text-sm sm:text-lg mb-4 sm:mb-6 animate-slide-up">
                                Download your favorite eBooks anytime, anywhere.
                            </p>
                            <a
                                href="/shop/ebooks"
                                className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105 text-sm sm:text-base"
                            >
                                Browse eBooks
                            </a>
                        </div>
                    </div>
                </div>

                {/* Slide 3: Affiliate */}
                <div className="relative w-full h-[50vh]">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-green-900 to-teal-800 flex items-center justify-center"
                        style={{
                            backgroundImage: `url('https://via.placeholder.com/1200x600?text=Affiliate')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="text-center text-white px-4 sm:px-8 max-w-3xl mx-auto">
                            <h2 className="text-2xl sm:text-4xl font-extrabold mb-2 sm:mb-4 animate-fade-in">
                                Join Our Affiliate Program
                            </h2>
                            <p className="text-sm sm:text-lg mb-4 sm:mb-6 animate-slide-up">
                                Earn commissions by promoting our products.
                            </p>
                            <a
                                href="/affiliate"
                                className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition transform hover:scale-105 text-sm sm:text-base"
                            >
                                Become an Affiliate
                            </a>
                        </div>
                    </div>
                </div>

                {/* Slide 4: Dropshipping */}
                <div className="relative w-full h-[50vh]">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-red-900 to-orange-800 flex items-center justify-center"
                        style={{
                            backgroundImage: `url('https://via.placeholder.com/1200x600?text=Dropshipping')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="text-center text-white px-4 sm:px-8 max-w-3xl mx-auto">
                            <h2 className="text-2xl sm:text-4xl font-extrabold mb-2 sm:mb-4 animate-fade-in">
                                Start Dropshipping Today
                            </h2>
                            <p className="text-sm sm:text-lg mb-4 sm:mb-6 animate-slide-up">
                                Launch your online store with zero inventory.
                            </p>
                            <a
                                href="/dropshipping"
                                className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition transform hover:scale-105 text-sm sm:text-base"
                            >
                                Start Dropshipping
                            </a>
                        </div>
                    </div>
                </div>
            </Slider>
        </div>
    );
};

export default ShopBanner;