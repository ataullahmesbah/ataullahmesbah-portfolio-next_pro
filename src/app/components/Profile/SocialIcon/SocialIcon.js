import { motion } from 'framer-motion';

export default function SocialIcon({ href, icon }) {
    return (
        <motion.a
            whileHover={{ y: -3 }}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
        >
            {icon}
        </motion.a>
    );
}