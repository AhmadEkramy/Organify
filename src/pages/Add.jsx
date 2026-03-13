import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales/translations';
import { FolderPlus, FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Add() {
    const { language } = useTheme();
    const t = useTranslation(language);
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6 pt-10 px-4"
        >
            <h1 className="text-2xl font-bold text-center mb-8">What to add?</h1>

            <div className="flex flex-col gap-6">
                <button
                    onClick={() => navigate('/add-category')}
                    className="neu-button p-8 flex flex-col items-center gap-4 text-lg font-bold border-2 border-transparent"
                >
                    <FolderPlus size={40} strokeWidth={1.5} />
                    {t('add_category')}
                </button>

                <button
                    onClick={() => navigate('/add-item')}
                    className="neu-button p-8 flex flex-col items-center gap-4 text-lg font-bold border-2 border-transparent"
                >
                    <FilePlus size={40} strokeWidth={1.5} />
                    {t('add_item')}
                </button>
            </div>
        </motion.div>
    );
}
