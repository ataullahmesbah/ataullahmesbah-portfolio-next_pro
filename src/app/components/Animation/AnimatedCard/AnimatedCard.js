// components/AnimatedCard.jsx
'use client';

import { motion } from 'framer-motion';

const AnimatedCard = ({ children, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 backdrop-blur-sm"
        >
            {children}
        </motion.div>
    );
};

export default AnimatedCard;