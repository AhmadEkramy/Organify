import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales/translations';
import { Layers, Package, ChevronRight, FileText, Search, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const { categories, items, habits = [] } = useData();
    const { language } = useTheme();
    const t = useTranslation(language);
    const navigate = useNavigate();

    const recentItems = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    // Calculate today's completions for habits
    const today = new Date().toISOString().split('T')[0];
    const completedToday = (habits || []).filter(h => h.frequency === 'daily' && h.completions.includes(today)).length;
    const totalDaily = (habits || []).filter(h => h.frequency === 'daily').length;

    return (
        <div className="flex flex-col gap-6">
            <header className="flex justify-between items-center py-4">
                <div className="flex items-center gap-3">
                    {/* Logo only visible on mobile at the top of Home page */}
                    <div className="md:hidden w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center p-1.5 overflow-hidden shadow-sm">
                        <img src="/logo.png" alt="Organify Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <p className="text-sm text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
                            {t('app_name')}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/search')}
                    className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center -mr-2"
                >
                    <Search size={22} />
                </button>
            </header>

            {/* Top Grid: Stats & Habit Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="neu-card p-5 pb-6 flex flex-col cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => navigate('/categories')}>
                        <Layers size={32} strokeWidth={1.5} className="mb-4" />
                        <h2 className="text-4xl font-bold -tracking-wider mb-1">{categories.length}</h2>
                        <p className="text-sm text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
                            {t('total_categories')}
                        </p>
                    </div>
                    <div className="neu-card p-5 pb-6 flex flex-col cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => navigate('/categories')}>
                        <Package size={32} strokeWidth={1.5} className="mb-4" />
                        <h2 className="text-4xl font-bold -tracking-wider mb-1">{items.length}</h2>
                        <p className="text-sm text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
                            {t('total_items')}
                        </p>
                    </div>
                </div>

                {/* Habits Entry Card */}
                <div
                    onClick={() => navigate('/habits')}
                    className="neu-card p-6 flex flex-col justify-between cursor-pointer bg-black text-white dark:bg-white dark:text-black overflow-hidden relative group transition-all hover:scale-[1.02] active:scale-95"
                >
                    <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Calendar size={140} />
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-white/20 dark:bg-black/10 flex items-center justify-center shrink-0">
                        <Calendar size={28} />
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-1">{t('habit_tracker')}</h3>
                        <p className="text-sm opacity-70 font-medium">
                            {totalDaily > 0
                                ? `${completedToday}/${totalDaily} Goals Completed`
                                : 'Start building new habits'}
                        </p>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <div className="w-10 h-10 rounded-full border border-white/20 dark:border-black/20 flex items-center justify-center group-hover:bg-white/10 dark:group-hover:bg-black/5 transition-colors">
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Items Section */}
            <div className="flex flex-col gap-6 mt-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{t('recent_items')}</h2>
                </div>

                {recentItems.length === 0 ? (
                    <div className="w-full bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] rounded-[2rem] py-16 flex flex-col items-center justify-center text-center shadow-[inset_4px_4px_8px_#e0e0e0,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.02)] border border-[var(--color-light-border)] dark:border-[var(--color-dark-border)]">
                        <p className="text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)] text-lg">
                            {t('no_items')}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/item/${item.id}`)}
                                className="neu-card hover:bg-[var(--color-light-surface)] dark:hover:bg-[var(--color-dark-surface)] p-4 flex items-center gap-4 cursor-pointer group hover:scale-[1.02] transition-all"
                            >
                                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)]">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><FileText size={24} className="opacity-40" /></div>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-bold truncate text-base">{item.title}</h3>
                                    <p className="text-sm text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)] truncate">
                                        {categories.find(c => c.id === item.categoryId)?.name || 'Misc'}
                                    </p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight size={20} className="opacity-40" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
