import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales/translations';
import { Folder, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Categories() {
    const { categories, deleteCategory } = useData();
    const { language } = useTheme();
    const t = useTranslation(language);
    const navigate = useNavigate();
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const rootCategories = categories.filter(c => !c.parentId);

    const toggleMenu = (id, e) => {
        e.stopPropagation();
        setMenuOpenId(menuOpenId === id ? null : id);
    };

    const handleDeleteClick = (id, e) => {
        e.stopPropagation();
        setDeleteTargetId(id);
        setMenuOpenId(null);
    };

    const confirmDelete = () => {
        if (deleteTargetId) {
            deleteCategory(deleteTargetId);
            setDeleteTargetId(null);
        }
    };

    const handleEdit = (id, e) => {
        e.stopPropagation();
        navigate(`/edit-category/${id}`);
        setMenuOpenId(null);
    };

    return (
        <div className="flex flex-col gap-6" onClick={() => setMenuOpenId(null)}>
            <header className="flex justify-between items-center py-4">
                <div>
                    <h1 className="text-2xl font-bold">{t('categories')}</h1>
                </div>
                <button
                    onClick={() => navigate('/add-category')}
                    className="hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-black/10 dark:shadow-white/10"
                >
                    <Icons.Plus size={20} strokeWidth={3} />
                    {t('add_category')}
                </button>
            </header>

            {rootCategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center gap-4 neu-card mt-10">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] flex items-center justify-center opacity-30">
                        <Folder size={32} />
                    </div>
                    <p className="font-medium text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
                        {t('no_categories')}
                    </p>
                    <button
                        onClick={() => navigate('/add-category')}
                        className="neu-button px-6 py-3 mt-4 text-sm font-bold"
                    >
                        {t('add_category')}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {rootCategories.map((category) => (
                        <motion.div
                            layoutId={category.id}
                            key={category.id}
                            className="neu-card p-4 relative cursor-pointer min-h-[140px] flex flex-col justify-between overflow-hidden group"
                            onClick={() => navigate(`/category/${category.id}`)}
                        >
                            {category.bgImage && (
                                <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30 group-hover:scale-110 transition-transform duration-500">
                                    <img src={category.bgImage} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="w-12 h-12 rounded-xl bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] flex items-center justify-center text-black dark:text-white shadow-inner backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 overflow-hidden">
                                    {category.icon && category.icon.startsWith('http') ? (
                                        <img src={category.icon} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        (() => {
                                            const IconComp = Icons[category.icon || 'Folder'] || Icons.Folder;
                                            return <IconComp size={24} />;
                                        })()
                                    )}
                                </div>
                                <button
                                    onClick={(e) => toggleMenu(category.id, e)}
                                    className="p-2 -mr-2 rounded-full hover:bg-[var(--color-light-surface)] dark:hover:bg-[var(--color-dark-surface)] transition-colors opacity-80 bg-[var(--color-light-surface)]/50 dark:bg-[var(--color-dark-surface)]/50 backdrop-blur-md"
                                >
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="relative z-10">
                                <h3 className="font-bold text-lg leading-tight mt-4 truncate">{category.name}</h3>
                            </div>

                            <AnimatePresence>
                                {menuOpenId === category.id && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="absolute top-12 right-4 neu-card p-2 w-32 z-10 flex flex-col gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            className="flex items-center gap-2 p-2 text-sm font-medium rounded-lg hover:bg-[var(--color-light-surface)] dark:hover:bg-[var(--color-dark-surface)] w-full text-left"
                                            onClick={(e) => handleEdit(category.id, e)}
                                        >
                                            <Edit2 size={14} /> {t('edit')}
                                        </button>
                                        <button
                                            className="flex items-center gap-2 p-2 text-sm font-medium rounded-lg hover:bg-[var(--color-light-surface)] dark:hover:bg-[var(--color-dark-surface)] w-full text-left text-red-500"
                                            onClick={(e) => handleDeleteClick(category.id, e)}
                                        >
                                            <Trash2 size={14} /> {t('delete')}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteTargetId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setDeleteTargetId(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm neu-card p-6 flex flex-col gap-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-center">{t('confirm_delete')}</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setDeleteTargetId(null)}
                                    className="neu-button py-3 font-bold"
                                >
                                    {t('no_cancel') || 'Cancel'}
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="neu-button py-3 font-bold text-red-500"
                                >
                                    {t('delete') || 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
