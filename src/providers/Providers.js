// providers/Providers.jsx
'use client';

import { SessionProvider } from "next-auth/react";


export default function Providers({ children }) {
    return (
        <SessionProvider
            refetchInterval={60} // Refetch session every 60 seconds (better for real-time updates)
            refetchOnWindowFocus={true}
            refetchWhenOffline={false}
        >
            {children}
        </SessionProvider>
    );
}
