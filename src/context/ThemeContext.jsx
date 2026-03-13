import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('language', language);
        // Arabic remains LTR as requested
        document.documentElement.setAttribute('lang', language);
        document.documentElement.setAttribute('dir', 'ltr');
    }, [language]);

    const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    const toggleLanguage = () => setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, language, toggleLanguage }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
