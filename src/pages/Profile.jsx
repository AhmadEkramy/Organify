import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useTranslation } from '../locales/translations';
import { User, Moon, Sun, Globe, Trash2, Info, Facebook, Instagram, Linkedin, MessageCircle, Code, Edit2, X, Save, LogOut, ShieldCheck } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
    const { theme, toggleTheme, language, toggleLanguage } = useTheme();
    const { clearAllData, user: profileUser, updateProfile } = useData();
    const t = useTranslation(language);
    const navigate = useNavigate();

    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState('');
    const [editImage, setEditImage] = useState('');

    useEffect(() => {
        if (profileUser) {
            setEditName(profileUser.name || '');
            setEditImage(profileUser.image || '');
        }
    }, [profileUser]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleClear = () => {
        clearAllData();
        setShowClearConfirm(false);
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        updateProfile(editName, editImage);
        setShowEditModal(false);
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            <header className="py-4">
                <h1 className="text-2xl font-bold">{t('profile')}</h1>
            </header>

            {/* User Info Card */}
            <div className="neu-card p-6 flex items-center justify-between mt-2">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] flex items-center justify-center shadow-inner overflow-hidden uppercase font-bold text-xl opacity-60">
                        {profileUser.image ? (
                            <img src={profileUser.image} alt={profileUser.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={32} strokeWidth={1.5} />
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold">{profileUser.name}</h2>
                            {profileUser.role === 'admin' && (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-wider border border-black/10 dark:border-white/10">
                                    <ShieldCheck size={10} />
                                    Admin
                                </div>
                            )}
                        </div>
                        <span className="text-[10px] font-medium tracking-widest opacity-40 uppercase truncate max-w-[150px]">{profileUser.email}</span>
                        <span className="text-[10px] font-bold tracking-widest opacity-60 uppercase">{t('app_name')} PRO</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => {
                            setEditName(profileUser.name);
                            setEditImage(profileUser.image);
                            setShowEditModal(true);
                        }}
                        className="w-10 h-10 rounded-full neu-button flex items-center justify-center opacity-60"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-10 h-10 rounded-full neu-button flex items-center justify-center !text-red-500 opacity-60"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Settings Column */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 px-2">{t('settings')}</h3>
                    <div className="flex flex-col gap-3">
                        {/* Dark Mode Toggle */}
                        <div className="neu-card p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full neu-button flex items-center justify-center opacity-80">
                                    {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                </div>
                                <span className="font-bold text-sm">{t('dark_mode')}</span>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`w-14 h-8 rounded-full border border-[var(--color-light-border)] dark:border-[var(--color-dark-border)] p-1 flex shadow-inner transition-colors duration-300 ${theme === 'dark' ? 'bg-[#333]' : 'bg-[#e0e0e0]'}`}
                            >
                                <motion.div
                                    animate={{ x: theme === 'dark' ? 24 : 0 }}
                                    className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-black"
                                />
                            </button>
                        </div>

                        {/* Language Toggle */}
                        <div className="neu-card p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full neu-button flex items-center justify-center opacity-80">
                                    <Globe size={18} />
                                </div>
                                <span className="font-bold text-sm">{t('language')}</span>
                            </div>
                            <button
                                onClick={toggleLanguage}
                                className="neu-button px-4 py-2 font-bold text-xs uppercase"
                            >
                                {language === 'en' ? 'English' : 'العربية'}
                            </button>
                        </div>

                        {/* Admin Panel Link */}
                        {profileUser.role === 'admin' && (
                            <div
                                onClick={() => navigate('/admin')}
                                className="neu-card p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors border-l-4 border-l-green-500"
                            >
                                <div className="w-10 h-10 rounded-full neu-button flex items-center justify-center text-green-500 opacity-80">
                                    <ShieldCheck size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm">Admin Panel</span>
                                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">Manage Users & Database</span>
                                </div>
                            </div>
                        )}

                        {/* Clear Data */}
                        <div
                            onClick={() => setShowClearConfirm(true)}
                            className="neu-card p-4 flex items-center gap-4 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full neu-button flex items-center justify-center !text-red-500 opacity-80">
                                <Trash2 size={18} />
                            </div>
                            <span className="font-bold text-sm">{t('clear_data')}</span>
                        </div>

                        {/* App Version */}
                        <div className="neu-card p-4 flex items-center justify-between opacity-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                                    <Info size={18} />
                                </div>
                                <span className="font-bold text-sm">{t('app_version')}</span>
                            </div>
                            <span className="font-mono text-xs font-bold px-4">v1.0.0</span>
                        </div>
                    </div>
                </div>

                {/* Creator Column */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 px-2">{t('app_creator')}</h3>
                    <div className="neu-card p-6 flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-lg overflow-hidden">
                                <img src="/profile.jpg" alt="Ahmed Ekramy" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <h4 className="font-bold text-lg">Ahmed Ekramy</h4>
                                <span className="text-xs font-bold opacity-60 uppercase tracking-tighter">{t('job_title')}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center gap-3">
                            <a
                                href="https://www.facebook.com/ahmed.ekramy.343411?rdid=cwjrFc2wlAlqJtR6&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16iD6otQMv%2F#"
                                target="_blank" rel="noopener noreferrer"
                                className="flex-1 h-12 rounded-xl neu-button flex items-center justify-center text-[#1877F2]"
                            >
                                <Facebook size={22} fill="currentColor" stroke="none" />
                            </a>
                            <a
                                href="https://www.instagram.com/_ahmedekramy/"
                                target="_blank" rel="noopener noreferrer"
                                className="flex-1 h-12 rounded-xl neu-button flex items-center justify-center text-[#E4405F]"
                            >
                                <Instagram size={22} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/ahmadekrami/"
                                target="_blank" rel="noopener noreferrer"
                                className="flex-1 h-12 rounded-xl neu-button flex items-center justify-center text-[#0A66C2]"
                            >
                                <Linkedin size={22} fill="currentColor" stroke="none" />
                            </a>
                            <a
                                href="https://wa.me/201094543689"
                                target="_blank" rel="noopener noreferrer"
                                className="flex-1 h-12 rounded-xl neu-button flex items-center justify-center text-[#25D366]"
                            >
                                <MessageCircle size={22} fill="currentColor" stroke="none" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clear Confirmation Modal */}
            <AnimatePresence>
                {showClearConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm neu-card p-6 flex flex-col gap-6 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mx-auto">
                                <Trash2 size={32} />
                            </div>

                            <h3 className="text-xl font-bold">{t('clear_data')}</h3>
                            <p className="text-sm opacity-80 leading-relaxed font-medium">
                                {t('confirm_reset')}
                            </p>

                            <div className="flex flex-col gap-3 mt-4">
                                <button
                                    onClick={handleClear}
                                    className="neu-button py-4 font-bold bg-red-500 !text-white !border-red-600 dark:bg-red-600 dark:!border-red-700"
                                >
                                    {t('yes_clear')}
                                </button>
                                <button
                                    onClick={() => setShowClearConfirm(false)}
                                    className="neu-button py-4 font-bold"
                                >
                                    {t('no_cancel')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm neu-card p-6 flex flex-col gap-6"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">{t('edit_profile')}</h3>
                                <button onClick={() => setShowEditModal(false)} className="opacity-60"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase opacity-50 pl-1">{t('title') || 'Name'}</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="neu-input py-3"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase opacity-50 pl-1">{t('image_url')}</label>
                                    <input
                                        type="url"
                                        value={editImage}
                                        onChange={(e) => setEditImage(e.target.value)}
                                        className="neu-input py-3 text-xs"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="neu-button flex-1 py-3 font-bold"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="neu-button flex-1 py-3 font-bold bg-black text-white dark:bg-white dark:text-black"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Save size={18} />
                                            {t('save')}
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
