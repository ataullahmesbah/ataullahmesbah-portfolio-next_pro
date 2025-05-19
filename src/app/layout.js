import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Script from 'next/script'; // Import the Script component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ataullah Mesbah",
  description: "Ataullah Mesbah, SEO Expert, World Explorer, Pouvoir en ligne, Web Development, Affiliate Marketing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Google Ads Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_AD_CLIENT_ID"
          strategy="lazyOnload" // Load the script after the page is interactive
          crossOrigin="anonymous"
        />
      </head>

      <body className={inter.className}>
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}