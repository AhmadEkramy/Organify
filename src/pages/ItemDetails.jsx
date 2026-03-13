import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales/translations';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Edit2, Trash2, FileText, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ItemDetails() {
    const { id } = useParams();
    const { items, categories, deleteItem } = useData();
    const { language } = useTheme();
    const t = useTranslation(language);
    const navigate = useNavigate();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const item = items.find(i => i.id === id);
    const category = item ? categories.find(c => c.id === item.categoryId) : null;

    if (!item) {
        return (
            <div className="p-8 text-center neu-card mt-8">
                <h2>Item Not Found</h2>
                <button onClick={() => navigate(-1)} className="neu-button px-4 py-2 mt-4 text-sm mx-auto">Go Back</button>
            </div>
        );
    }

    const handleDelete = () => {
        deleteItem(id);
        navigate(-1);
    };

    return (
        <div className="flex flex-col gap-6 pb-12">
            <header className="flex items-center justify-between py-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full neu-button flex items-center justify-center -ml-2 shrink-0"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/edit-item/${id}`)}
                        className="w-10 h-10 rounded-full neu-button flex items-center justify-center opacity-80"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-10 h-10 rounded-full neu-button flex items-center justify-center text-red-500 opacity-80"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </header>

            {/* Image Container */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`w-full aspect-[4/3] neu-card rounded-2xl overflow-hidden -mt-2 ${item.image ? 'cursor-pointer group relative' : ''}`}
                onClick={() => item.image && setPreviewImage(item.image)}
            >
                {item.image ? (
                    <>
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                                <Maximize2 size={20} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)]">
                        <FileText size={48} className="opacity-20" />
                    </div>
                )}
            </motion.div>

            {/* Content */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-6"
            >
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
                        {category ? category.name : 'Unknown'}
                    </span>
                    <h1 className="text-3xl font-bold leading-tight">{item.title}</h1>
                </div>

                {item.description && (
                    <div className="p-5 neu-card rounded-2xl">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {item.description}
                        </p>
                    </div>
                )}

                {(item.externalLinks && item.externalLinks.length > 0 ? item.externalLinks : (item.externalLink ? [item.externalLink] : [])).map((link, index) => (
                    <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neu-button p-4 flex items-center w-full justify-between mt-2 group"
                    >
                        <span className="font-bold truncate max-w-[250px] md:max-w-md opacity-80 group-hover:opacity-100 transition-opacity">
                            {link}
                        </span>
                        <ExternalLink size={20} className="shrink-0 ml-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                ))}
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm neu-card p-6 flex flex-col gap-6"
                        >
                            <h3 className="text-xl font-bold text-center">{t('confirm_delete')}</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="neu-button py-3 font-bold"
                                >
                                    {t('no_cancel')}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="neu-button py-3 font-bold text-red-500"
                                >
                                    {t('delete')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Image Preview Modal */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
                        onClick={() => setPreviewImage(null)}
                    >
                        <motion.button
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <X size={24} />
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative max-w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-full object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
