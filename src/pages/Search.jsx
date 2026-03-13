import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales/translations';
import { Search as SearchIcon, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Search() {
    const { items, categories } = useData();
    const { language } = useTheme();
    const t = useTranslation(language);
    const navigate = useNavigate();

    const [query, setQuery] = useState('');

    const filteredItems = items.filter(
        (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
    );

    return (
        <div className="flex flex-col gap-6">
            <header className="py-4">
                <h1 className="text-2xl font-bold">{t('search')}</h1>
            </header>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <SearchIcon size={20} className="text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)]" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('search') + '...'}
                    className="neu-input pl-12 pr-4"
                    autoFocus
                />
            </div>

            <div className="flex flex-col gap-4 mt-2">
                {query.trim() === '' ? (
                    <div className="flex items-center justify-center p-12 opacity-30">
                        <SearchIcon size={48} />
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 opacity-50 text-center gap-2">
                        <FileText size={48} />
                        <p className="font-medium text-sm">No results found for "{query}"</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filteredItems.map((item) => {
                            const category = categories.find(c => c.id === item.categoryId);
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/item/${item.id}`)}
                                    className="neu-card p-3 flex items-center gap-4 cursor-pointer"
                                >
                                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)]">
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><FileText size={20} className="opacity-40" /></div>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="font-bold truncate text-sm">{item.title}</h3>
                                        <p className="text-xs text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)] truncate">
                                            {category ? category.name : 'Misc'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
