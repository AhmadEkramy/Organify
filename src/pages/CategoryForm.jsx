import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales/translations';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Save, X, ChevronLeft, Search } from 'lucide-react';
import * as Icons from 'lucide-react';

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

// Flatten to a deduplicated array of objects containing the icon name and its searchable keywords
const ICONS_WITH_TAGS = Array.from(new Map(
    Object.entries(ICON_CATEGORIES).flatMap(([tags, icons]) =>
        icons.map(name => [name, { name, searchTerms: `${name.toLowerCase()} ${tags.toLowerCase()}` }])
    )
).values());

export default function CategoryForm() {
    const { id } = useParams();
    const { categories, addCategory, updateCategory } = useData();
    const { language } = useTheme();
    const t = useTranslation(language);
    const navigate = useNavigate();
    const location = useLocation();
    const parentId = location.state?.parentId || null;

    const [name, setName] = useState('');
    const [icon, setIcon] = useState('Folder');
    const [bgImage, setBgImage] = useState('');
    const [isIconModalOpen, setIsIconModalOpen] = useState(false);
    const [iconSearchQuery, setIconSearchQuery] = useState('');

    useEffect(() => {
        if (id) {
            const category = categories.find(c => c.id === id);
            if (category) {
                setName(category.name);
                setIcon(category.icon || 'Folder');
                setBgImage(category.bgImage || '');
            }
        }
    }, [id, categories]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (id) {
            updateCategory(id, name, icon, bgImage);
        } else {
            addCategory(name, parentId, icon, bgImage);
        }
        navigate(-1);
    };

    return (
        <div className="flex flex-col gap-8">
            <header className="flex items-center gap-4 py-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full neu-button flex items-center justify-center -ml-2 shrink-0"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold flex-1">
                    {id ? t('edit') : t('add_category')}
                </h1>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold opacity-80">{t('category_name')}</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="neu-input"
                        placeholder={t('category_name')}
                        autoFocus
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold opacity-80">Custom Icon URL (Optional)</label>
                    <input
                        type="url"
                        value={icon.startsWith('http') ? icon : ''}
                        onChange={(e) => setIcon(e.target.value || 'Folder')}
                        className="neu-input"
                        placeholder="https://example.com/icon.png"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold opacity-80">{t('image_url') || 'Background Image URL'}</label>
                    <input
                        type="url"
                        value={bgImage}
                        onChange={(e) => setBgImage(e.target.value)}
                        className="neu-input"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold opacity-80">{t('choose_icon')}</label>
                    <button
                        type="button"
                        onClick={() => setIsIconModalOpen(true)}
                        className="neu-button flex items-center justify-between p-4 bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] w-full text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-dark-surface)] text-white dark:bg-white dark:text-black flex items-center justify-center shadow-inner overflow-hidden">
                                {icon && icon.startsWith('http') ? (
                                    <img src={icon} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    (() => {
                                        const IconComp = Icons[icon] || Icons.Folder;
                                        return <IconComp size={20} />;
                                    })()
                                )}
                            </div>
                            <span className="font-bold truncate max-w-[150px]">{icon && icon.startsWith('http') ? 'Custom URL' : icon}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] opacity-80 shadow-sm">
                            <Search size={16} />
                        </div>
                    </button>
                </div>

                <div className="flex gap-4 mt-8">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="neu-button flex-1 py-4 flex items-center justify-center gap-2 font-bold"
                    >
                        <X size={20} />
                        {t('cancel')}
                    </button>

                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="neu-button flex-1 py-4 flex items-center justify-center gap-2 font-bold bg-black text-white dark:bg-white dark:text-black disabled:opacity-50"
                    >
                        <Save size={20} />
                        {t('save')}
                    </button>
                </div>
            </form>

            {isIconModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsIconModalOpen(false)}
                    ></div>
                    <div className="neu-card bg-[var(--color-light-bg)] dark:bg-[var(--color-dark-bg)] relative z-10 w-full max-w-sm h-3/4 max-h-[600px] flex flex-col p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg">{t('choose_icon')}</h2>
                            <button type="button" onClick={() => setIsIconModalOpen(false)} className="w-8 h-8 flex items-center justify-center opacity-60 hover:opacity-100 neu-button rounded-full">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="relative mb-4 shrink-0">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="opacity-50" />
                            </div>
                            <input
                                type="text"
                                value={iconSearchQuery}
                                onChange={(e) => setIconSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="neu-input pl-10 w-full py-3"
                                autoFocus
                            />
                        </div>
                        <div className="grid grid-cols-5 gap-3 overflow-y-auto p-1 pr-2 -mr-2" style={{ scrollbarWidth: 'thin' }}>
                            {(() => {
                                const cleanQuery = iconSearchQuery.toLowerCase().replace(/\s+/g, '');
                                const filteredIcons = ICONS_WITH_TAGS.filter(item =>
                                    item.searchTerms.includes(cleanQuery) || item.searchTerms.includes(iconSearchQuery.toLowerCase())
                                );

                                if (filteredIcons.length === 0) {
                                    return (
                                        <div className="col-span-5 flex items-center justify-center p-8 opacity-50 text-sm font-medium">
                                            No icons found
                                        </div>
                                    );
                                }

                                return filteredIcons.map(({ name: iconName }) => {
                                    const IconComp = Icons[iconName];
                                    if (!IconComp) return null;

                                    return (
                                        <button
                                            key={iconName}
                                            type="button"
                                            onClick={() => {
                                                setIcon(iconName);
                                                setIsIconModalOpen(false);
                                                setIconSearchQuery('');
                                            }}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shrink-0 ${icon === iconName
                                                ? 'bg-[var(--color-dark-surface)] text-white dark:bg-white dark:text-black shadow-lg scale-110'
                                                : 'neu-button text-[var(--color-light-text-secondary)] dark:text-[var(--color-dark-text-secondary)] hover:bg-[var(--color-light-surface)] dark:hover:bg-[var(--color-dark-surface)]'
                                                }`}
                                        >
                                            <IconComp size={24} />
                                        </button>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
