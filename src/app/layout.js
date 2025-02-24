import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";


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
        {/* Metadata */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <title>{metadata.title}</title>
      </head>

      <body
        className={inter.className}>

        <Providers>

          {children}
        </Providers>


      </body>

    </html>
  );
}
