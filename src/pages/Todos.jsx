import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales/translations';
import { Check, Trash2, Plus, Clock, Edit3, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Todos() {
    const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useData();
    const { language } = useTheme();
    const t = useTranslation(language);
    const [newTodo, setNewTodo] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (newTodo.trim()) {
            addTodo(newTodo.trim());
            setNewTodo('');
        }
    };

    const pendingTodos = todos.filter(t => !t.completed);
    const completedTodos = todos.filter(t => t.completed);

    return (
        <div className="flex flex-col gap-6 pb-20">
            <header className="flex justify-between items-center py-4">
                <div>
                    <h1 className="text-2xl font-bold">{t('todo_list')}</h1>
                    <p className="text-sm text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
                        {pendingTodos.length} Pending
                    </p>
                </div>
            </header>

            {/* Add Todo Form */}
            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder={t('add_todo')}
                    className="neu-input flex-1 py-4"
                />
                <button
                    type="submit"
                    disabled={!newTodo.trim()}
                    className="neu-button shrink-0 w-14 rounded-2xl flex items-center justify-center bg-black text-white dark:bg-white dark:text-black disabled:opacity-50 transition-opacity"
                >
                    <Plus size={26} />
                </button>
            </form>

            {/* Todo List */}
            {todos.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center gap-4 neu-card mt-8">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] flex items-center justify-center opacity-30 shadow-inner">
                        <Clock size={32} />
                    </div>
                    <p className="font-medium text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
                        {t('no_todos')}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    {/* Pending */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-bold opacity-50 uppercase tracking-widest pl-2 mb-2">Pending</h3>
                        {pendingTodos.length > 0 ? (
                            <AnimatePresence mode="popLayout">
                                {pendingTodos.map(todo => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        onToggle={() => toggleTodo(todo.id)}
                                        onDelete={() => deleteTodo(todo.id)}
                                        onUpdate={(text) => updateTodo(todo.id, text)}
                                    />
                                ))}
                            </AnimatePresence>
                        ) : (
                            <p className="text-sm opacity-40 pl-2">All caught up!</p>
                        )}
                    </div>

                    {/* Completed */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-bold opacity-50 uppercase tracking-widest pl-2 mb-2">Completed</h3>
                        {completedTodos.length > 0 ? (
                            <AnimatePresence mode="popLayout">
                                {completedTodos.map(todo => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        onToggle={() => toggleTodo(todo.id)}
                                        onDelete={() => deleteTodo(todo.id)}
                                        onUpdate={(text) => updateTodo(todo.id, text)}
                                    />
                                ))}
                            </AnimatePresence>
                        ) : (
                            <p className="text-sm opacity-40 pl-2">None yet</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const handleSave = () => {
        if (editText.trim() && editText.trim() !== todo.text) {
            onUpdate(editText.trim());
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditText(todo.text);
        setIsEditing(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`neu-card p-4 flex items-center gap-4 transition-all ${todo.completed ? 'opacity-60 bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] shadow-none scale-[0.98]' : ''}`}
        >
            {!isEditing ? (
                <>
                    <button
                        onClick={onToggle}
                        className={`w-6 h-6 rounded flex shrink-0 items-center justify-center transition-all duration-300 border-2 ${todo.completed
                            ? 'border-green-500 bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)] scale-110'
                            : 'border-[var(--color-light-text-secondary)] dark:border-[var(--color-dark-text-secondary)] opacity-50 hover:opacity-100 hover:scale-110'
                            }`}
                    >
                        {todo.completed && <Check size={14} strokeWidth={4} />}
                    </button>
                    <span className={`flex-1 font-semibold text-[15px] transition-all duration-300 ${todo.completed ? 'line-through opacity-70 decoration-2 decoration-green-500/50' : ''}`}>
                        {todo.text}
                    </span>
                    <div className="flex gap-1">
                        {!todo.completed && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-10 h-10 flex shrink-0 items-center justify-center text-blue-500 hover:bg-blue-500/10 transition-colors rounded-xl"
                            >
                                <Edit3 size={18} />
                            </button>
                        )}
                        <button
                            onClick={onDelete}
                            className="w-10 h-10 flex shrink-0 items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors rounded-xl"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex flex-1 gap-2 items-center">
                    <input
                        autoFocus
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') handleCancel();
                        }}
                        className="neu-input flex-1 py-2 px-3 text-sm"
                    />
                    <button
                        onClick={handleSave}
                        className="w-9 h-9 flex shrink-0 items-center justify-center bg-green-500 text-white rounded-xl shadow-lg active:scale-90 transition-all"
                    >
                        <Save size={18} />
                    </button>
                    <button
                        onClick={handleCancel}
                        className="w-9 h-9 flex shrink-0 items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-xl active:scale-90 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
        </motion.div>
    );
}
