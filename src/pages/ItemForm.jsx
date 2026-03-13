import { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales/translations';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Save, X, ChevronLeft, Upload, Image as ImageIcon } from 'lucide-react';

export default function ItemForm() {
    const { id } = useParams();
    const location = useLocation();
    const defaultCategoryId = location.state?.categoryId || '';

    const { items, categories, addItem, updateItem } = useData();
    const { language } = useTheme();
    const t = useTranslation(language);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        categoryId: defaultCategoryId,
        description: '',
        externalLinks: [''],
        image: ''
    });

    useEffect(() => {
        if (id) {
            const item = items.find(i => i.id === id);
            if (item) {
                const links = item.externalLinks || (item.externalLink ? [item.externalLink] : ['']);
                setFormData({ ...item, externalLinks: links.length > 0 ? links : [''] });
            }
        } else if (categories.length > 0 && !defaultCategoryId) {
            setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
        }
    }, [id, items, categories, defaultCategoryId]);

    const handleLinkChange = (index, value) => {
        const newLinks = [...formData.externalLinks];
        newLinks[index] = value;
        setFormData(prev => ({ ...prev, externalLinks: newLinks }));
    };

    const addLinkField = () => {
        setFormData(prev => ({ ...prev, externalLinks: [...prev.externalLinks, ''] }));
    };

    const removeLinkField = (index) => {
        setFormData(prev => ({
            ...prev,
            externalLinks: prev.externalLinks.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.categoryId) return;

        const cleanedData = {
            ...formData,
            externalLinks: formData.externalLinks.filter(l => l.trim() !== '')
        };

        if (id) {
            updateItem(id, cleanedData);
        } else {
            addItem(cleanedData);
        }
        navigate(-1);
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            <header className="flex items-center gap-4 py-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full neu-button flex items-center justify-center -ml-2 shrink-0"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold flex-1 truncate">
                    {id ? t('edit') : t('add_item')}
                </h1>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Image Upload Area */}
                <div
                    className="w-full aspect-[16/9] neu-card rounded-2xl flex flex-col items-center justify-center overflow-hidden relative cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {formData.image ? (
                        <>
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload color="white" size={32} />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3 opacity-50 p-6 text-center">
                            <ImageIcon size={32} />
                            <span className="text-sm font-medium">Tap to upload image</span>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                <div className="flex flex-col gap-2 -mt-2">
                    <p className="text-xs font-bold opacity-50 text-center">{t('or_paste_url')}</p>
                    <input
                        type="url"
                        name="image"
                        value={formData.image?.startsWith('data:image') ? '' : formData.image}
                        onChange={handleChange}
                        className="neu-input text-sm text-center"
                        placeholder="https://..."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold opacity-80">{t('title')}</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="neu-input"
                        placeholder={t('title')}
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold opacity-80">{t('select_category')}</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="neu-input appearance-none bg-transparent"
                        required
                    >
                        <option value="" disabled className="text-black">{t('select_category')}</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id} className="text-black bg-white">{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold opacity-80">{t('description')}</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="neu-input min-h-[120px] resize-none"
                        placeholder={t('description')}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold opacity-80">{t('external_link')}</label>
                    {formData.externalLinks.map((link, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="url"
                                value={link}
                                onChange={(e) => handleLinkChange(index, e.target.value)}
                                className="neu-input flex-1"
                                placeholder="https://..."
                            />
                            {formData.externalLinks.length > 1 && (
                                <button type="button" onClick={() => removeLinkField(index)} className="neu-button w-12 flex items-center justify-center text-red-500 shrink-0">
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addLinkField} className="text-sm self-start opacity-70 hover:opacity-100 font-bold mt-1">
                        + Add link
                    </button>
                </div>

                <div className="flex gap-4 mt-6">
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
                        disabled={!formData.title.trim() || !formData.categoryId}
                        className="neu-button flex-1 py-4 flex items-center justify-center gap-2 font-bold bg-[var(--color-light-text-primary)] text-white dark:bg-white dark:text-black disabled:opacity-50"
                    >
                        <Save size={20} />
                        {t('save')}
                    </button>
                </div>
            </form>
        </div>
    );
}
