import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales/translations';
import { Home, Grid, Plus, ListTodo, User, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Layout() {
    const { language } = useTheme();
    const t = useTranslation(language);
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: t('home'), path: '/home', icon: Home },
        { name: t('categories'), path: '/categories', icon: Grid },
        { name: t('add'), path: '/add', icon: Plus, isFab: true },
        { name: t('todo_list'), path: '/todos', icon: ListTodo },
        { name: t('profile'), path: '/profile', icon: User },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-[var(--color-light-bg)] dark:bg-[var(--color-dark-bg)] flex flex-col md:flex-row">
            {/* Sidebar Navigation - Desktop Only */}
            <aside className="hidden md:flex w-64 lg:w-72 flex-col bg-white dark:bg-[var(--color-dark-surface)] border-r border-[var(--color-light-border)] dark:border-[var(--color-dark-border)] h-screen sticky top-0 z-40 p-6">
                <div className="mb-10 flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center p-1.5 overflow-hidden">
                        <img src="/logo.png" alt="Organify Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Organify</span>
                </div>

                <nav className="flex-1">
                    <ul className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            if (item.isFab) return null;
                            const isActive = location.pathname.startsWith(item.path);

                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive
                                            ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/5'
                                            : 'text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)] hover:bg-[#f3f4f6] dark:hover:bg-[#1a1a1a]'
                                            }`}
                                    >
                                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="font-semibold">{item.name}</span>
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="mt-auto">
                    <button
                        onClick={() => navigate('/add')}
                        className="w-full py-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center gap-2 font-bold hover:scale-[1.02] transition-transform active:scale-[0.98] shadow-lg shadow-black/20 dark:shadow-white/10"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                        {t('add')}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-h-screen flex flex-col pb-24 md:pb-0">
                <motion.main
                    key={location.pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="container mx-auto max-w-md md:max-w-4xl lg:max-w-5xl px-4 md:px-8 lg:px-12 pt-6 md:pt-10"
                >
                    <Outlet />
                </motion.main>
            </div>

            {/* Bottom Navigation - Mobile Only */}
            <nav className="md:hidden fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-white dark:bg-[var(--color-dark-surface)] border-t border-[var(--color-light-border)] dark:border-[var(--color-dark-border)] z-40 px-2 h-20">
                <ul className="flex justify-between items-center relative h-full">
                    {navItems.map((item) => {
                        if (item.isFab) {
                            return (
                                <li key="fab" className="w-[60px]">
                                    {/* Placeholder for spacing, FAB is absolutely positioned */}
                                </li>
                            );
                        }

                        const isActive = location.pathname.startsWith(item.path);

                        return (
                            <li key={item.path} className="flex-1 flex justify-center">
                                <NavLink
                                    to={item.path}
                                    className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#f3f4f6] dark:bg-[var(--color-dark-bg)] text-black dark:text-white' : 'text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)] hover:bg-[#f9fafb] dark:hover:bg-[#1a1a1a]'}`}
                                >
                                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-xs font-semibold">{item.name}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Floating Action Button (Center) - Mobile Only */}
            <div className="md:hidden fixed left-1/2 -translate-x-1/2 z-50 bottom-[50px]">
                <button
                    onClick={() => navigate('/add')}
                    className="w-[60px] h-[60px] rounded-full bg-[#111] text-white dark:bg-white dark:text-black flex items-center justify-center transform transition-transform duration-300 active:scale-95 shadow-[0_4px_14px_rgba(0,0,0,0.25)] dark:shadow-[0_4px_14px_rgba(255,255,255,0.25)]"
                >
                    <Plus size={28} strokeWidth={2} />
                </button>
            </div>
        </div>
    );
}
