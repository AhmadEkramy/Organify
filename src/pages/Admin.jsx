import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales/translations';
import {
    Users,
    Shield,
    ShieldAlert,
    Trash2,
    Search,
    Mail,
    Phone,
    ArrowLeft,
    ChevronRight,
    UserCheck,
    UserX,
    Filter
} from 'lucide-react';
import { db } from '../firebase';
import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Admin() {
    const { user: currentUser } = useData();
    const { language } = useTheme();
    const t = useTranslation(language);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);

    // Security: Only allow admins
    useEffect(() => {
        if (!loading && currentUser?.role !== 'admin') {
            navigate('/home');
        }
    }, [currentUser, loading, navigate]);

    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching users:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateDoc(doc(db, 'users', userId), { role: newRole });
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (userId === currentUser.uid) {
            alert("You cannot delete yourself!");
            return;
        }
        if (window.confirm("Are you sure? This will remove the user from the database. (Note: Auth account remains)")) {
            try {
                await deleteDoc(doc(db, 'users', userId));
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone?.includes(searchQuery);

        const matchesRole = filterRole === 'all' || user.role === filterRole;

        return matchesSearch && matchesRole;
    });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 pb-24">
            <header className="flex flex-col gap-4 py-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-10 h-10 rounded-full neu-button flex items-center justify-center"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black italic tracking-tighter">ADMIN PANEL</h1>
                        <p className="text-xs font-bold opacity-50 uppercase tracking-[0.2em]">Manage All Users</p>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="neu-card p-4 flex flex-col gap-1">
                        <Users size={24} className="opacity-40 mb-2" />
                        <span className="text-2xl font-black">{users.length}</span>
                        <span className="text-[10px] font-bold opacity-50 uppercase">Total Users</span>
                    </div>
                    <div className="neu-card p-4 flex flex-col gap-1">
                        <Shield size={24} className="text-green-500 opacity-40 mb-2" />
                        <span className="text-2xl font-black text-green-500">
                            {users.filter(u => u.role === 'admin').length}
                        </span>
                        <span className="text-[10px] font-bold opacity-50 uppercase">Admins</span>
                    </div>
                </div>
            </header>

            {/* Controls */}
            <div className="flex flex-col gap-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="neu-input w-full pl-12 py-4"
                    />
                </div>

                <div className="flex gap-2">
                    {['all', 'user', 'admin'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${filterRole === role ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105' : 'bg-gray-100 dark:bg-gray-800 opacity-60'}`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users List */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase tracking-widest pl-2 opacity-40">User Directory</h3>
                <AnimatePresence>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredUsers.map((user) => (
                            <motion.div
                                layout
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="neu-card p-4 flex items-center gap-4 relative overflow-hidden"
                            >
                                {/* Role Indicator Strip */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${user.role === 'admin' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`} />

                                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                                    {user.image ? (
                                        <img src={user.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-lg font-black opacity-30">{user.name?.[0]}</span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold truncate text-sm">{user.name}</h4>
                                        {user.role === 'admin' && <Shield size={12} className="text-green-500" />}
                                    </div>
                                    <div className="flex flex-col gap-0.5 opacity-50">
                                        <div className="flex items-center gap-1 text-[10px] font-bold">
                                            <Mail size={10} />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-1 text-[10px] font-bold">
                                                <Phone size={10} />
                                                <span>{user.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${user.role === 'admin' ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20'}`}
                                        title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                    >
                                        {user.role === 'admin' ? <ShieldAlert size={18} /> : <UserCheck size={18} />}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                                        title="Delete User"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>

                {filteredUsers.length === 0 && (
                    <div className="py-20 text-center opacity-30 font-black flex flex-col items-center gap-4">
                        <Users size={60} />
                        <p>No users found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}
