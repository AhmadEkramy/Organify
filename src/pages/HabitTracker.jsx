import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales/translations';
import { Plus, Check, Calendar, Trash2, Trophy, Edit3, Search, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ICON_CATEGORIES = {
    "technology devices tech electronics computer mobile phone gadget screen screen display smart connection": [
        'Monitor', 'Smartphone', 'Laptop', 'Watch', 'Gamepad', 'Battery', 'Wifi', 'Bluetooth', 'HardDrive',
        'Usb', 'Cpu', 'Server', 'Printer', 'Keyboard', 'Mouse', 'Globe', 'Cloud', 'Database', 'Code', 'Terminal', 'Tv'
    ],
    "food drink eat meal restaurant diet cooking nutrition fruit vegetable hot cold beverage coffee": [
        'Coffee', 'Utensils', 'Pizza', 'CupSoda', 'Wine', 'Beer', 'Apple', 'Carrot', 'Cherry', 'Cookie', 'Croissant',
        'Egg', 'Fish', 'Grape', 'IceCream', 'Lemon', 'Milk', 'Sandwich', 'Salad', 'Soup', 'Steak', 'Sushi', 'Wheat'
    ],
    "travel outdoors trip nature vehicle map location transport direction pin marker vacation": [
        'Map', 'MapPin', 'Compass', 'Navigation', 'Plane', 'Car', 'Bus', 'Train', 'Truck', 'Bike', 'Anchor',
        'Tent', 'TreePine', 'Mountain', 'Sun', 'Moon', 'CloudRain', 'CloudSnow', 'CloudLightning', 'Wind', 'Thermometer',
        'Droplet', 'Leaf', 'Feather', 'Globe', 'Ship', 'Sailboat', 'Rocket', 'Tram', 'CableCar', 'Motorcycle'
    ],
    "home buildings house architecture property realestate city town place": [
        'Home', 'Building', 'Store', 'Factory', 'Castle', 'Warehouse', 'Hotel', 'School', 'Hospital', 'Church',
        'House', 'Apartment', 'Garage', 'Garden', 'Lamp', 'Sofa', 'Bed', 'Bath', 'Shower', 'Toilet', 'DoorOpen'
    ],
    "people communication user chat message contact network social talk connect person identity profile": [
        'User', 'Users', 'UserPlus', 'UserMinus', 'UserCheck', 'UserX', 'Mail', 'MessageSquare', 'MessageCircle', 'Phone',
        'Share', 'Share2', 'Link', 'AtSign', 'Hash', 'Send', 'Voicemail', 'VideoOff', 'PhoneCall', 'PhoneMissed'
    ],
    "settings tools gear customization option configuration control fix edit modify interface ui": [
        'Settings', 'Tool', 'Wrench', 'Hammer', 'Key', 'Lock', 'Unlock', 'Shield', 'ShieldCheck', 'Scissors', 'PenTool', 'Edit',
        'Cog', 'Sliders', 'Filter', 'Search', 'ZoomIn', 'ZoomOut', 'Trash2', 'Copy', 'Paste', 'Cut', 'RotateCcw', 'RefreshCcw',
        'Download', 'Upload', 'Save', 'Printer', 'QrCode', 'Barcode', 'Fingerprint', 'KeyRound', 'GripVertical', 'GripHorizontal'
    ],
    "time date calendar schedule clock watch alarm morning night day history past future": [
        'Clock', 'Calendar', 'Bell', 'AlarmClock', 'Timer', 'Hourglass', 'Watch', 'Sunrise', 'Sunset', 'MoonStar'
    ],
    "status alerts notification warning error success mark sign shape symbol indicate danger info": [
        'CheckCircle', 'Info', 'AlertCircle', 'HelpCircle', 'Lightbulb', 'XCircle', 'AlertTriangle', 'Check', 'X', 'Plus', 'Minus',
        'Question', 'Exclamation', 'Slash', 'Circle', 'Square', 'Triangle', 'Diamond', 'Octagon', 'Hexagon'
    ],
    "nature weather environment climate plant animal pet sky season outside eco": [
        'Sun', 'Moon', 'Cloud', 'Umbrella', 'Wind', 'Thermometer', 'Droplet', 'Leaf', 'Feather', 'Mountain',
        'CloudDrizzle', 'CloudFog', 'CloudHail', 'CloudRain', 'CloudSnow', 'CloudLightning', 'Sunrise', 'Sunset', 'Rainbow',
        'Droplets', 'Flower', 'Grass', 'Tree', 'PawPrint', 'Bug', 'Spider', 'Fish', 'Bird', 'Snake', 'Frog', 'Rabbit', 'Dog', 'Cat'
    ],
    "health medical doctor hospital body gym fitness medicine pills wellness care energy life": [
        'Activity', 'Smile', 'Frown', 'Meh', 'Eye', 'EyeOff', 'Cross', 'Stethoscope', 'Dumbbell', 'HeartPulse', 'Pill',
        'Syringe', 'Bandage', 'FirstAid', 'ThermometerSnowflake', 'ThermometerSun', 'Weight', 'Lungs', 'Brain', 'Bone'
    ],
    "sports activities game play recreation exercise physical hobby win reward": [
        'Dumbbell', 'Bike', 'Run', 'Walk', 'Swimmer', 'Football', 'Basketball', 'Volleyball', 'Tennis', 'TableTennis',
        'Bowling', 'Golf', 'Skate', 'Snowflake', 'Flame', 'Target', 'Trophy', 'Award', 'Medal', 'Gamepad'
    ],
    "arrows directions navigation movement move point indicate cursor guide": [
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ChevronUp', 'ChevronDown', 'ChevronLeft', 'ChevronRight',
        'ChevronsUp', 'ChevronsDown', 'ChevronsLeft', 'ChevronsRight', 'CornerUpLeft', 'CornerUpRight', 'CornerDownLeft',
        'CornerDownRight', 'Move', 'Maximize', 'Minimize', 'Expand', 'Shrink', 'ExternalLink', 'InternalLink', 'RefreshCw'
    ],
    "media audio video playback control record sound listen watch studio music entertainment sound wave art film picture": [
        'Play', 'Pause', 'Stop', 'FastForward', 'Rewind', 'Volume2', 'VolumeX', 'MonitorPlay', 'Tv', 'Music', 'Video', 'Film',
        'Camera', 'Image', 'Mic', 'Headphones', 'Speaker', 'Radio', 'Palette'
    ],
    "finance money shop store cart business trade commerce transaction investment pay": [
        'Briefcase', 'ShoppingBag', 'ShoppingCart', 'CreditCard', 'DollarSign', 'Wallet', 'Gift', 'Receipt'
    ],
    "popular common ui basic web document folder file action item design general": [
        'Folder', 'FolderOpen', 'File', 'FileText', 'Archive', 'Box', 'Package', 'Tag', 'Bookmark', 'Flag',
        'Star', 'Heart', 'Award', 'Trophy', 'Crown', 'ThumbsUp', 'Zap', 'Flame', 'Grid', 'Layout', 'Columns', 'Rows',
        'Table', 'List', 'ListOrdered', 'ListPlus', 'ListMinus', 'ListX', 'Hash', 'PlusSquare', 'MinusSquare', 'XSquare',
        'CheckSquare', 'BookOpen', 'Book', 'Pen', 'Pencil', 'Eraser', 'Brush', 'PaintBucket', 'Crop', 'Magnet', 'Gauge',
        'ShieldOff', 'Power', 'ToggleLeft', 'ToggleRight', 'WifiOff', 'BluetoothOff', 'Volume', 'Volume1', 'Mute', 'MicOff',
        'Cast', 'Airplay', 'MonitorSpeaker', 'MousePointer', 'Crosshair', 'Target', 'Disc', 'Cd', 'Dvd', 'FloppyDisk',
        'BatteryCharging', 'BatteryFull', 'BatteryLow', 'BatteryMedium', 'BatteryWarning', 'Plug', 'PlugZap', 'Send',
        'Link2', 'Paperclip', 'Clipboard', 'ClipboardCheck', 'ClipboardCopy', 'ClipboardList', 'ClipboardPaste', 'ClipboardX',
        'CopyCheck', 'CopyMinus', 'CopyPlus', 'CopySlash', 'CopyX', 'Trash', 'Layers', 'LifeBuoy', 'LogOut', 'Menu',
        'Minimize', 'MoreHorizontal', 'MoreVertical', 'Percent', 'Play', 'Plus', 'Pocket', 'Repeat', 'Rewind', 'Search',
        'Settings', 'Share', 'Shuffle', 'Sidebar', 'SkipBack', 'SkipForward', 'Slash', 'Sliders', 'Star', 'Stop', 'Tag',
        'Terminal', 'ThumbsDown', 'ThumbsUp', 'Tool', 'TrendingDown', 'TrendingUp', 'Triangle', 'Type', 'Upload', 'X', 'Zap', 'ZoomIn', 'ZoomOut'
    ]
};

const ICONS_WITH_TAGS = Array.from(new Map(
    Object.entries(ICON_CATEGORIES).flatMap(([tags, icons]) =>
        icons.map(name => [name, { name, searchTerms: `${name.toLowerCase()} ${tags.toLowerCase()}` }])
    )
).values());

export default function HabitTracker() {
    const { habits, addHabit, toggleHabit, deleteHabit, updateHabit, reorderHabit } = useData();
    const { language } = useTheme();
    const t = useTranslation(language);

    const [activeFrequency, setActiveFrequency] = useState('daily');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [editingHabitId, setEditingHabitId] = useState(null);
    const [habitName, setHabitName] = useState('');
    const [habitIcon, setHabitIcon] = useState('Activity');

    const [showIconPicker, setShowIconPicker] = useState(false);
    const [iconSearchQuery, setIconSearchQuery] = useState('');

    const frequencies = [
        { id: 'daily', label: t('daily') },
        { id: 'weekly', label: t('weekly') },
        { id: 'monthly', label: t('monthly') }
    ];

    const currentPeriod = useMemo(() => {
        const now = new Date();
        if (activeFrequency === 'daily') {
            return now.toISOString().split('T')[0];
        } else if (activeFrequency === 'weekly') {
            const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
            const dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum);
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
            return `${d.getUTCFullYear()}-W${weekNo}`;
        } else {
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        }
    }, [activeFrequency]);

    const filteredHabits = habits
        .filter(h => h.frequency === activeFrequency)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    const handleSaveHabit = (e) => {
        e.preventDefault();
        if (habitName.trim()) {
            if (modalMode === 'add') {
                addHabit(habitName.trim(), activeFrequency, habitIcon);
            } else {
                updateHabit(editingHabitId, habitName.trim(), activeFrequency, habitIcon);
            }
            setHabitName('');
            setHabitIcon('Activity');
            setShowModal(false);
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        setHabitName('');
        setHabitIcon('Activity');
        setShowModal(true);
    };

    const openEditModal = (habit) => {
        setModalMode('edit');
        setEditingHabitId(habit.id);
        setHabitName(habit.name);
        setHabitIcon(habit.icon || 'Activity');
        setActiveFrequency(habit.frequency);
        setShowModal(true);
    };

    return (
        <div className="flex flex-col gap-6 pb-24">
            <header className="flex justify-between items-center py-4">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent italic uppercase">
                        {t('habit_tracker')}
                    </h1>
                    <p className="text-xs font-bold opacity-50 uppercase tracking-[0.2em]">
                        {t('elevate_routine')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={openAddModal}
                        className="hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-black/10 dark:shadow-white/10"
                    >
                        <Plus size={20} strokeWidth={3} />
                        {t('new_habit')}
                    </button>
                    <div className="flex items-center justify-center p-2 rounded-2xl bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] shadow-inner">
                        <Trophy size={20} className="text-yellow-500" />
                    </div>
                </div>
            </header>

            {/* Frequency Tabs */}
            <div className="flex p-1.5 rounded-2xl bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] relative">
                {frequencies.map((freq) => (
                    <button
                        key={freq.id}
                        onClick={() => setActiveFrequency(freq.id)}
                        className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-all duration-300 ${activeFrequency === freq.id ? 'text-black dark:text-white' : 'text-gray-400'}`}
                    >
                        {freq.label}
                        {activeFrequency === freq.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-white dark:bg-[var(--color-dark-card)] rounded-xl shadow-sm z-[-1]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Habit List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredHabits.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center p-10 neu-card border-dashed border-2 opacity-50"
                        >
                            <Calendar size={40} className="mb-4 text-gray-400" />
                            <p className="font-bold text-gray-500">{t('no_habits')}</p>
                            <button
                                onClick={openAddModal}
                                className="mt-4 text-sm font-black underline decoration-2 underline-offset-4 uppercase"
                            >
                                {t('start_tracking')}
                            </button>
                        </motion.div>
                    ) : (
                        filteredHabits.map((habit, index) => (
                            <HabitItem
                                key={habit.id}
                                habit={habit}
                                currentPeriod={currentPeriod}
                                onToggle={() => toggleHabit(habit.id, currentPeriod)}
                                onDelete={() => deleteHabit(habit.id)}
                                onEdit={() => openEditModal(habit)}
                                onMove={(dir) => reorderHabit(habit.id, dir)}
                                isFirst={index === 0}
                                isLast={index === filteredHabits.length - 1}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Add Action - Mobile Only */}
            <div className="md:hidden fixed bottom-28 right-6 z-40">
                <button
                    onClick={openAddModal}
                    className="w-14 h-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-2xl active:scale-90 transition-all group"
                >
                    <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>

            {/* Habit Modal Overlay */}
            <AnimatePresence mode="wait">
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setShowModal(false); setShowIconPicker(false); }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            className="relative w-full max-w-sm bg-white dark:bg-[var(--color-dark-surface)] rounded-[2rem] p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-6 sm:hidden" />
                            <h2 className="text-2xl font-black mb-6">{modalMode === 'add' ? t('new_habit') : t('edit_habit')}</h2>

                            <AnimatePresence mode="wait">
                                {!showIconPicker ? (
                                    <motion.form
                                        key="main-form"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 20, opacity: 0 }}
                                        onSubmit={handleSaveHabit}
                                        className="flex flex-col gap-6"
                                    >
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-2 flex-1">
                                                <label className="text-xs font-black uppercase tracking-widest opacity-50 pl-1">{t('habit_name')}</label>
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={habitName}
                                                    onChange={(e) => setHabitName(e.target.value)}
                                                    placeholder="e.g. Read for 30 mins"
                                                    className="neu-input text-lg py-4 px-6 border-none ring-1 ring-black/5 dark:ring-white/5"
                                                />
                                            </div>

                                            <div className="flex gap-4 items-end">
                                                <div className="flex flex-col gap-2 flex-1">
                                                    <label className="text-xs font-black uppercase tracking-widest opacity-50 pl-1">{t('image_url')}</label>
                                                    <input
                                                        type="url"
                                                        value={habitIcon.startsWith('http') ? habitIcon : ''}
                                                        onChange={(e) => setHabitIcon(e.target.value || 'Activity')}
                                                        placeholder="https://example.com/icon.png"
                                                        className="neu-input text-sm py-4 px-6 border-none ring-1 ring-black/5 dark:ring-white/5"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-black uppercase tracking-widest opacity-50 pl-1">{t('choose_icon')}</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowIconPicker(true)}
                                                        className="w-[60px] h-[60px] rounded-2xl neu-button flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden"
                                                    >
                                                        {habitIcon.startsWith('http') ? (
                                                            <img src={habitIcon} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            (() => {
                                                                const IconComp = Icons[habitIcon] || Icons.Activity;
                                                                return <IconComp size={28} />;
                                                            })()
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-black uppercase tracking-widest opacity-50 pl-1">{t('frequency')}</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {frequencies.map(f => (
                                                    <button
                                                        key={f.id}
                                                        type="button"
                                                        onClick={() => setActiveFrequency(f.id)}
                                                        className={`py-3 rounded-2xl text-[10px] font-black transition-all ${activeFrequency === f.id ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105' : 'bg-gray-100 dark:bg-gray-800 opacity-60'}`}
                                                    >
                                                        {f.label.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="flex-1 py-4 font-bold text-gray-500 uppercase"
                                            >
                                                {t('cancel')}
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={!habitName.trim()}
                                                className="flex-[2] py-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-black shadow-xl disabled:opacity-30 disabled:grayscale transition-all uppercase"
                                            >
                                                {modalMode === 'add' ? t('create_habit') : t('save_changes')}
                                            </button>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="icon-picker"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        className="flex flex-col gap-4 h-[400px]"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={iconSearchQuery}
                                                    onChange={(e) => setIconSearchQuery(e.target.value)}
                                                    placeholder={t('search_icons')}
                                                    className="neu-input w-full pl-10 py-3 text-sm"
                                                />
                                            </div>
                                            <button
                                                onClick={() => setShowIconPicker(false)}
                                                className="p-3 rounded-xl neu-button"
                                            >
                                                <Icons.X size={20} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-4 gap-3 overflow-y-auto pr-2 flex-1 pb-4">
                                            {(() => {
                                                const query = iconSearchQuery.toLowerCase();
                                                const filtered = ICONS_WITH_TAGS.filter(i => i.searchTerms.includes(query));

                                                if (filtered.length === 0) return <div className="col-span-4 text-center py-10 opacity-40 font-bold">No icons found</div>;

                                                return filtered.map(({ name }) => {
                                                    const IconComp = Icons[name];
                                                    if (!IconComp) return null; // Added safety check

                                                    return (
                                                        <button
                                                            key={name}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setHabitIcon(name);
                                                                setShowIconPicker(false);
                                                            }}
                                                            className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all ${habitIcon === name ? 'bg-black text-white dark:bg-white dark:text-black shadow-xl ring-2 ring-black dark:ring-white ring-offset-2 dark:ring-offset-gray-900' : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                                        >
                                                            <IconComp size={24} />
                                                        </button>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function HabitItem({ habit, currentPeriod, onToggle, onDelete, onEdit, onMove, isFirst, isLast }) {
    const isCompleted = habit.completions.includes(currentPeriod);
    const completionRate = habit.completions.length > 0 ? Math.min(100, (habit.completions.length * 10)) : 0;
    const { language } = useTheme();
    const t = useTranslation(language);

    // Safety check for icon
    const IconComponent = Icons[habit.icon] || Icons.Activity || Icons.Calendar || (() => null);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`group relative overflow-hidden neu-card p-4 flex items-center gap-4 transition-all duration-500 ${isCompleted ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200/50 dark:border-green-800/30' : ''}`}
        >
            {/* Background progress indicator */}
            <div
                className="absolute left-0 bottom-0 h-1 bg-green-500/20 transition-all duration-1000"
                style={{ width: `${completionRate}%` }}
            />

            {/* Reorder Buttons */}
            <div className="flex flex-col gap-1 opacity-10 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); !isFirst && onMove('up'); }}
                    disabled={isFirst}
                    className={`p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-10`}
                >
                    <Icons.ChevronUp size={16} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); !isLast && onMove('down'); }}
                    disabled={isLast}
                    className={`p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-10`}
                >
                    <Icons.ChevronDown size={16} />
                </button>
            </div>

            {/* Left Icon Display */}
            <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center transition-all duration-500 border-2 overflow-hidden ${isCompleted
                ? 'bg-black dark:bg-white border-black dark:border-white shadow-lg'
                : 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5'
                }`}>
                {habit.icon && habit.icon.startsWith('http') ? (
                    <img
                        src={habit.icon}
                        alt=""
                        className={`w-full h-full object-cover transition-opacity duration-500 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}
                    />
                ) : (
                    <IconComponent size={24} className={isCompleted ? 'text-white dark:text-black' : 'opacity-40'} />
                )}
            </div>

            {/* Habit Content */}
            <div className="flex-1 min-w-0">
                <h3 className={`font-black text-lg truncate transition-all duration-500 ${isCompleted ? 'opacity-40 italic' : ''}`}>
                    {habit.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-40">
                        {t('streak')}: {habit.completions.length}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-40">
                        {t(habit.frequency)}
                    </span>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
                <button
                    onClick={onToggle}
                    className={`p-3 rounded-xl transition-all duration-300 ${isCompleted
                        ? 'bg-green-500 text-white shadow-lg scale-110'
                        : 'text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30'}`}
                >
                    <Check size={20} strokeWidth={isCompleted ? 4 : 2} />
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all translate-x-0 sm:translate-x-4 group-hover:translate-x-0">
                    <button
                        onClick={onEdit}
                        className="p-2 text-blue-500/50 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl transition-all"
                    >
                        <Icons.Edit3 size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                    >
                        <Icons.Trash2 size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

