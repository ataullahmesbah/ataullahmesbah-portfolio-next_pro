// app/components/Travel/ResponsiveImage.jsx
'use client';
import Image from "next/image";

export default function ResponsiveImage({
    src,
    alt,
    type = 'default',
    priority = false,
    sizes = '100vw',
    className = ''
}) {
    // Define responsive sizes based on image type
    const sizeConfig = {
        'gallery': {
            mobile: '50vw',
            tablet: '33vw',
            desktop: '25vw',
            maxWidth: 400
        },
        'historical': {
            mobile: '100vw',
            tablet: '50vw',
            desktop: '33vw',
            maxWidth: 500
        },
        'detail': {
            mobile: '100vw',
            tablet: '100vw',
            desktop: '100vw',
            maxWidth: 1200
        },
        'journey': {
            mobile: '100vw',
            tablet: '100vw',
            desktop: '100vw',
            maxWidth: 2000
        }
    };

    const config = sizeConfig[type] || sizeConfig['default'];

    // Generate responsive sizes string for Next.js Image
    const responsiveSizes = `(max-width: 640px) ${config.mobile}, (max-width: 1024px) ${config.tablet}, ${config.desktop}`;

    return (
        <Image
            src={src}
            alt={alt}
            fill={!config.maxWidth}
            width={config.maxWidth ? config.maxWidth : undefined}
            height={config.maxWidth ? Math.round(config.maxWidth / 1.5) : undefined}
            className={`object-cover ${className}`}
            sizes={responsiveSizes}
            priority={priority}
            quality={type === 'detail' || type === 'journey' ? 90 : 85}
            loading={priority ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRh4AAABXRUJQVlA4IBAAAAAQAgCdASoDAAIAAQAcJaQAA3AA/v89WAAAAA=="
        />
    );
}

// Usage Examples:
/*
1. Gallery Grid:
<ResponsiveImage 
  src={photo.imageUrl}
  alt={photo.title}
  type="gallery"
/>

2. Historical Card:
<ResponsiveImage 
  src={site.imageUrl}
  alt={site.title}
  type="historical"
/>

3. Detail Page:
<ResponsiveImage 
  src={travel.imageUrl}
  alt={travel.title}
  type="detail"
  priority={true}
/>

4. Journey Hero:
<ResponsiveImage 
  src={journey.imageUrl}
  alt={journey.title}
  type="journey"
  priority={true}
/>
*/