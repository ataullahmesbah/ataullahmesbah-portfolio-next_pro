
// providers/Providers.jsx
'use client';

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
    return (
        <SessionProvider
            refetchInterval={5 * 60} // Refetch session every 5 minutes
            refetchOnWindowFocus={true}
        >
            {children}
            {/* ToastProvider is now in layout.js outside of SessionProvider but inside Providers */}
        </SessionProvider>
    );
}
