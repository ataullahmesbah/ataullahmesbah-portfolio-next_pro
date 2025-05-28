'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function TrackAffiliateVisits({ children }) {
    const searchParams = useSearchParams();

    useEffect(() => {
        const affCode = searchParams.get('aff');
        if (affCode) {
            fetch('/api/affiliate/track-visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    affiliateCode: affCode,
                    visitedPage: window.location.pathname,
                    visitorIp: 'unknown',
                }),
            }).catch((error) => console.error('Error tracking visit:', error));
        }
    }, [searchParams]);

    return <>{children}</>;
}