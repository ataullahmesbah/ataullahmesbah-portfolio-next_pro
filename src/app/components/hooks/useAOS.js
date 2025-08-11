// src/hooks/useAOS.js
'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function useAOS(options = {}) {
    useEffect(() => {
        if (typeof window !== "undefined") {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                ...options,
            });
            AOS.refresh();
        }
    }, [options]);
}
