import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Splash() {
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/home', { replace: true });
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className={`fixed inset-0 flex flex-col items-center justify-center transition-colors duration-500 overflow-hidden ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center gap-4"
            >
                <div className="w-24 h-24 rounded-[2rem] bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-2xl p-4 overflow-hidden">
                    <img src="/logo.png" alt="Organify Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-3xl font-bold tracking-widest font-mono uppercase mt-4">
                    Organify
                </h1>
                <p className="text-sm opacity-50 tracking-widest">
                    SIMPLIFY YOUR LIFE
                </p>
            </motion.div>
        </div>
    );
}
