import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales/translations';
import { ChevronLeft, FileText, Plus, Folder, MoreVertical, Edit2, Trash2, X, Maximize2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CategoryDetails() {
    const { id } = useParams();
    const { categories, items, deleteCategory } = useData();
    const { language } = useTheme();
    const t = useTranslation(language);
    const navigate = useNavigate();
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const category = categories.find((c) => c.id === id);
    const categoryItems = items.filter((item) => item.categoryId === id);
    const subCategories = categories.filter((c) => c.parentId === id);

    const toggleMenu = (menuId, e) => {
        e.stopPropagation();
        setMenuOpenId(menuOpenId === menuId ? null : menuId);
    };

    const handleDeleteClick = (targetId, e) => {
        e.stopPropagation();
        setDeleteTargetId(targetId);
        setMenuOpenId(null);
    };

    const confirmDelete = async () => {
        if (deleteTargetId) {
            const isDeletingCurrent = deleteTargetId === id;
            const parentId = category?.parentId;
            await deleteCategory(deleteTargetId);
            setDeleteTargetId(null);

            if (isDeletingCurrent) {
                if (parentId) {
                    navigate(`/category/${parentId}`);
                } else {
                    navigate('/categories');
                }
            }
        }
    };

    const handleEdit = (editId, e) => {
        e.stopPropagation();
        navigate(`/edit-category/${editId}`);
        setMenuOpenId(null);
    };

    if (!category) {
        return (
            <div className="p-8 text-center neu-card mt-8">
                <h2>Category Not Found</h2>
                <button onClick={() => navigate(-1)} className="neu-button px-4 py-2 mt-4 text-sm mx-auto">Go Back</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6" onClick={() => setMenuOpenId(null)}>
            <header className="flex items-center gap-4 py-4 relative">
                <button
                    onClick={() => {
                        if (category.parentId) {
                            navigate(`/category/${category.parentId}`);
                        } else {
                            navigate('/categories');
                        }
                    }}
                    className="w-10 h-10 rounded-full neu-button flex items-center justify-center -ml-2 shrink-0"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-xl bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] flex items-center justify-center shadow-inner shrink-0 text-black dark:text-white backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 overflow-hidden">
                    {category.icon && category.icon.startsWith('http') ? (
                        <img src={category.icon} alt="" className="w-full h-full object-cover" />
                    ) : (
                        (() => {
                            const IconComp = Icons[category.icon || 'Folder'] || Icons.Folder;
                            return <IconComp size={20} />;
                        })()
                    )}
                </div>
                <div className="flex-1 overflow-hidden">
                    <h1 className="text-2xl font-bold truncate">{category.name}</h1>
                    <p className="text-sm opacity-60">{categoryItems.length} {t('items')}</p>
                </div>
                <button
                    onClick={(e) => toggleMenu(category.id, e)}
                    className="w-10 h-10 rounded-full neu-button flex items-center justify-center shrink-0"
                >
                    <MoreVertical size={20} />
                </button>

                <AnimatePresence>
                    {menuOpenId === category.id && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="absolute top-16 right-0 neu-card p-2 w-32 z-50 flex flex-col gap-1 shadow-xl"
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
            </header>

            {/* Main Category Image */}
            {category.bgImage && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full aspect-[16/9] rounded-3xl overflow-hidden neu-card p-2 cursor-pointer relative group"
                    onClick={() => setPreviewImage(category.bgImage)}
                >
                    <div className="w-full h-full rounded-2xl overflow-hidden relative">
                        <img
                            src={category.bgImage}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                                <Maximize2 size={24} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Subcategories Section */}
            {subCategories.length > 0 && (
                <div className="flex flex-col gap-3">
                    <h2 className="text-lg font-bold">Subcategories</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {subCategories.map((sub) => (
                            <div key={sub.id} className={`neu-card p-4 flex items-center gap-3 cursor-pointer hover:bg-[var(--color-light-surface)] dark:hover:bg-[var(--color-dark-surface)] transition-colors relative group ${menuOpenId === sub.id ? '' : 'overflow-hidden'}`} onClick={() => navigate(`/category/${sub.id}`)}>
                                {sub.bgImage && (
                                    <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30 group-hover:scale-110 transition-transform duration-500 rounded-xl overflow-hidden">
                                        <img src={sub.bgImage} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="relative z-10 w-10 h-10 rounded-xl bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] flex items-center justify-center shadow-inner shrink-0 text-black dark:text-white backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 overflow-hidden">
                                    {sub.icon && sub.icon.startsWith('http') ? (
                                        <img src={sub.icon} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        (() => {
                                            const IconComp = Icons[sub.icon || 'Folder'] || Icons.Folder;
                                            return <IconComp size={20} />;
                                        })()
                                    )}
                                </div>
                                <h3 className="relative z-10 font-bold text-sm truncate flex-1">{sub.name}</h3>

                                <button
                                    onClick={(e) => toggleMenu(sub.id, e)}
                                    className="relative z-10 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors opacity-60 hover:opacity-100"
                                >
                                    <MoreVertical size={16} />
                                </button>

                                <AnimatePresence>
                                    {menuOpenId === sub.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="absolute top-10 right-2 neu-card p-1.5 w-28 z-50 flex flex-col gap-0.5 shadow-lg border border-black/5 dark:border-white/5"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                className="flex items-center gap-2 p-1.5 text-xs font-medium rounded-lg hover:bg-[var(--color-light-surface)] dark:hover:bg-[var(--color-dark-surface)] w-full text-left"
                                                onClick={(e) => handleEdit(sub.id, e)}
                                            >
                                                <Edit2 size={12} /> {t('edit')}
                                            </button>
                                            <button
                                                className="flex items-center gap-2 p-1.5 text-xs font-medium rounded-lg hover:bg-[var(--color-light-surface)] dark:hover:bg-[var(--color-dark-surface)] w-full text-left text-red-500"
                                                onClick={(e) => handleDeleteClick(sub.id, e)}
                                            >
                                                <Trash2 size={12} /> {t('delete')}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mt-2">
                <h2 className="text-lg font-bold">{t('items')} & Actions</h2>
                <div className="flex gap-2">
                    <button onClick={() => navigate('/add-category', { state: { parentId: id } })} className="neu-button p-2 px-3 text-xs bg-[var(--color-light-surface)] font-bold">
                        + Subcategory
                    </button>
                    <button onClick={() => navigate('/add-item', { state: { categoryId: id } })} className="neu-button p-2 px-3 text-xs bg-[var(--color-light-text-primary)] text-white dark:bg-white dark:text-black font-bold">
                        + Item
                    </button>
                </div>
            </div>

            {categoryItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center gap-4 neu-card mt-2">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] flex items-center justify-center opacity-30">
                        <FileText size={32} />
                    </div>
                    <p className="font-medium text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
                        {t('no_items')}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {categoryItems.map((item) => (
                        <div
                            key={item.id}
                            className="neu-card p-3 flex flex-col gap-3 cursor-pointer group"
                            onClick={() => navigate(`/item/${item.id}`)}
                        >
                            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] relative transition-transform duration-300 group-active:scale-95 group-active:opacity-80">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FileText size={24} className="opacity-30" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm line-clamp-1">{item.title}</h3>
                                <p className="text-xs text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)] line-clamp-2 mt-1 min-h-[32px]">
                                    {item.description || '...'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteTargetId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setDeleteTargetId(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm neu-card p-6 flex flex-col gap-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-center">{t('confirm_delete')}</h3>
                            <p className="text-center opacity-70 -mt-4 text-sm">
                                This will also delete all subcategories and items within it.
                            </p>

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
