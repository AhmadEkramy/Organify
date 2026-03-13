import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db, auth } from '../firebase';
import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    addDoc,
    writeBatch
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const DataContext = createContext();

export function DataProvider({ children }) {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [todos, setTodos] = useState([]);
    const [habits, setHabits] = useState([]);
    const [user, setUser] = useState({ name: 'User', image: '/profile.jpg' });
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (!user) setLoading(false);
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        console.log("Current Auth State:", currentUser ? "Logged In" : "Not Logged In");
        if (currentUser) console.log("Current User UID:", currentUser.uid);

        if (!currentUser) {
            setCategories([]);
            setItems([]);
            setTodos([]);
            setHabits([]);
            setUser({ name: 'Guest', image: '/profile.jpg' });
            return;
        }

        const userId = currentUser.uid;

        // Real-time listeners with doc creation fallback
        const unsubUser = onSnapshot(doc(db, 'users', userId),
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    setUser(docSnapshot.data());
                } else {
                    // Create basic doc if it doesn't exist to prevent permission errors
                    setDoc(doc(db, 'users', userId), {
                        uid: userId,
                        name: currentUser.displayName || 'User',
                        email: currentUser.email,
                        role: 'user',
                        createdAt: new Date().toISOString()
                    }, { merge: true });
                }
            },
            (err) => console.warn("User listener (initializing):", err)
        );

        const unsubCats = onSnapshot(query(collection(db, 'categories'), where('userId', '==', userId)),
            (snapshot) => setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
            (err) => console.error("Categories error:", err)
        );

        const unsubItems = onSnapshot(query(collection(db, 'items'), where('userId', '==', userId)),
            (snapshot) => setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
            (err) => console.error("Items error:", err)
        );

        const unsubTodos = onSnapshot(query(collection(db, 'todos'), where('userId', '==', userId)),
            (snapshot) => setTodos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
            (err) => console.error("Todos error:", err)
        );

        const unsubHabits = onSnapshot(query(collection(db, 'habits'), where('userId', '==', userId)),
            (snapshot) => {
                setHabits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            },
            (err) => {
                console.error("Habits error:", err);
                setLoading(false);
            }
        );

        return () => {
            unsubUser();
            unsubCats();
            unsubItems();
            unsubTodos();
            unsubHabits();
        };
    }, [currentUser]);

    const addCategory = async (name, parentId = null, icon = 'Folder', bgImage = '') => {
        if (!currentUser) return;
        const newCategory = {
            name,
            parentId,
            icon,
            bgImage,
            userId: currentUser.uid,
            createdAt: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, 'categories'), newCategory);
        return docRef.id;
    };

    const updateCategory = async (id, name, icon = 'Folder', bgImage = '') => {
        await updateDoc(doc(db, 'categories', id), { name, icon, bgImage });
    };

    const deleteCategory = async (id) => {
        // Find all subcategories recursively
        const idsToDelete = new Set([id]);
        let changed = true;
        while (changed) {
            changed = false;
            for (const cat of categories) {
                if (cat.parentId && idsToDelete.has(cat.parentId) && !idsToDelete.has(cat.id)) {
                    idsToDelete.add(cat.id);
                    changed = true;
                }
            }
        }

        const batch = writeBatch(db);
        idsToDelete.forEach(catId => {
            batch.delete(doc(db, 'categories', catId));
        });

        // Also find and delete items in these categories
        items.forEach(item => {
            if (idsToDelete.has(item.categoryId)) {
                batch.delete(doc(db, 'items', item.id));
            }
        });

        await batch.commit();
    };

    const addItem = async (itemData) => {
        if (!currentUser) return;
        await addDoc(collection(db, 'items'), {
            ...itemData,
            userId: currentUser.uid,
            createdAt: new Date().toISOString()
        });
    };

    const updateItem = async (id, itemData) => {
        await updateDoc(doc(db, 'items', id), itemData);
    };

    const deleteItem = async (id) => {
        await deleteDoc(doc(db, 'items', id));
    };

    const addTodo = async (text) => {
        if (!currentUser) return;
        await addDoc(collection(db, 'todos'), {
            text,
            completed: false,
            userId: currentUser.uid,
            createdAt: new Date().toISOString()
        });
    };

    const toggleTodo = async (id) => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            await updateDoc(doc(db, 'todos', id), { completed: !todo.completed });
        }
    };

    const deleteTodo = async (id) => {
        await deleteDoc(doc(db, 'todos', id));
    };

    const updateTodo = async (id, text) => {
        await updateDoc(doc(db, 'todos', id), { text });
    };

    const addHabit = async (name, frequency, icon = 'Activity') => {
        if (!currentUser) return;
        // Get the current max sortOrder for this frequency
        const freqHabits = habits.filter(h => h.frequency === frequency);
        const maxSortOrder = freqHabits.length > 0 ? Math.max(...freqHabits.map(h => h.sortOrder || 0)) : 0;

        await addDoc(collection(db, 'habits'), {
            name,
            frequency,
            icon,
            completions: [],
            sortOrder: maxSortOrder + 1,
            userId: currentUser.uid,
            createdAt: new Date().toISOString()
        });
    };

    const toggleHabit = async (id, period) => {
        const habit = habits.find(h => h.id === id);
        if (habit) {
            const completions = habit.completions.includes(period)
                ? habit.completions.filter(p => p !== period)
                : [...habit.completions, period];
            await updateDoc(doc(db, 'habits', id), { completions });
        }
    };

    const deleteHabit = async (id) => {
        await deleteDoc(doc(db, 'habits', id));
    };

    const updateHabit = async (id, name, frequency, icon = 'Activity') => {
        await updateDoc(doc(db, 'habits', id), { name, frequency, icon });
    };

    const reorderHabit = async (id, direction) => {
        const habit = habits.find(h => h.id === id);
        if (!habit) return;

        const freqHabits = habits
            .filter(h => h.frequency === habit.frequency)
            .sort((a, b) => {
                const orderA = a.sortOrder !== undefined ? a.sortOrder : 0;
                const orderB = b.sortOrder !== undefined ? b.sortOrder : 0;
                if (orderA !== orderB) return orderA - orderB;
                return new Date(a.createdAt) - new Date(b.createdAt);
            });

        const currentIndex = freqHabits.findIndex(h => h.id === id);
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex >= 0 && targetIndex < freqHabits.length) {
            const h1 = freqHabits[currentIndex];
            const h2 = freqHabits[targetIndex];

            const batch = writeBatch(db);
            // Swapping by assigning their current indices ensures they have unique and correctly ordered values
            batch.update(doc(db, 'habits', h1.id), { sortOrder: targetIndex });
            batch.update(doc(db, 'habits', h2.id), { sortOrder: currentIndex });
            await batch.commit();
        }
    };

    const updateProfile = async (name, image) => {
        if (!currentUser) return;
        await updateDoc(doc(db, 'users', currentUser.uid), { name, image });
    };

    const clearAllData = async () => {
        if (!currentUser) return;
        const batch = writeBatch(db);

        categories.forEach(c => batch.delete(doc(db, 'categories', c.id)));
        items.forEach(i => batch.delete(doc(db, 'items', i.id)));
        todos.forEach(t => batch.delete(doc(db, 'todos', t.id)));
        habits.forEach(h => batch.delete(doc(db, 'habits', h.id)));

        await batch.commit();
    };

    return (
        <DataContext.Provider value={{
            categories, items, todos, habits, user, loading,
            addCategory, updateCategory, deleteCategory,
            addItem, updateItem, deleteItem,
            addTodo, toggleTodo, deleteTodo, updateTodo,
            addHabit, toggleHabit, deleteHabit, updateHabit, reorderHabit,
            updateProfile,
            clearAllData
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
}
