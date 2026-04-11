import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Megaphone, 
  Plus, 
  PencilSimple, 
  Trash, 
  X, 
  UploadSimple, 
  CheckCircle, 
  Clock, 
  WarningCircle,
  CurrencyInr,
  ShoppingCart,
  List as ListIcon,
  Image as ImageIcon
} from '@phosphor-icons/react';

const AdminCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);

    // Items Management State (for the integrated form)
    const [formItems, setFormItems] = useState([]);

    // Campaign Form State
    const [formData, setFormData] = useState({
        title: '',
        short_description: '',
        description: '',
        goal_amount: '',
        status: 'active'
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch('/api/admin/campaigns', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch campaigns');
            const data = await res.json();
            setCampaigns(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleAddFormItem = () => {
        setFormItems([...formItems, { item_name: '', price_per_unit: '', unit_name: 'unit', image: null, preview: null }]);
    };

    const handleRemoveFormItem = (index) => {
        setFormItems(formItems.filter((_, i) => i !== index));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formItems];
        newItems[index][field] = value;
        setFormItems(newItems);
    };

    const handleItemImageChange = (index, file) => {
        const newItems = [...formItems];
        newItems[index].image = file;
        const reader = new FileReader();
        reader.onloadend = () => {
            newItems[index].preview = reader.result;
            setFormItems([...newItems]);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('admin_token');
        
        // 1. Submit Campaign
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imageFile) data.append('image', imageFile);

        try {
            const url = editingCampaign ? `/api/admin/campaigns/${editingCampaign.id}` : '/api/admin/campaigns';
            const method = editingCampaign ? 'PUT' : 'POST';
            
            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            if (!res.ok) throw new Error('Campaign save failed');
            const resData = await res.json();
            const campaignId = editingCampaign ? editingCampaign.id : resData.id;

            // 2. Submit New Items (only for new items in the list)
            for (const item of formItems) {
                if (item.id) continue; // Skip existing items (they are managed separately in this version to avoid complexity)
                
                const itemData = new FormData();
                itemData.append('item_name', item.item_name);
                itemData.append('price_per_unit', item.price_per_unit);
                itemData.append('unit_name', item.unit_name);
                if (item.image) itemData.append('image', item.image);

                await fetch(`/api/admin/campaigns/${campaignId}/items`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: itemData
                });
            }
            
            setShowModal(false);
            setEditingCampaign(null);
            setFormItems([]);
            setImageFile(null);
            setImagePreview(null);
            fetchCampaigns();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (campaign) => {
        setEditingCampaign(campaign);
        setFormData({
            title: campaign.title,
            short_description: campaign.short_description || '',
            description: campaign.description || '',
            goal_amount: campaign.goal_amount,
            status: campaign.status,
            current_amount: campaign.current_amount
        });
        setImagePreview(campaign.image_url);
        
        // Fetch existing items
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`/api/admin/campaigns/${campaign.id}/items`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const items = await res.json();
            setFormItems(items.map(item => ({ ...item, preview: item.image_url })));
        } catch (err) {
            setFormItems([]);
        }

        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This will delete all related item contributions as well.')) return;
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`/api/admin/campaigns/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Delete failed');
            fetchCampaigns();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Remove this item?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`/api/admin/items/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Delete failed');
            setFormItems(formItems.filter(i => i.id !== itemId));
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <Helmet>
                <title>Manage Campaigns | Admin Dashboard</title>
            </Helmet>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Megaphone size={28} className="text-saffron" weight="duotone" />
                        Manage Welfare Campaigns
                    </h1>
                    <p className="text-gray-500 mt-1">Create and manage targeted mission-driven donation causes.</p>
                </div>
                <button 
                    onClick={() => {
                        setEditingCampaign(null);
                        setFormData({ title: '', short_description: '', description: '', goal_amount: '', status: 'active' });
                        setFormItems([]);
                        setImagePreview(null);
                        setShowModal(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-saffron hover:bg-saffron/90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                >
                    <Plus size={20} weight="bold" />
                    New Campaign
                </button>
            </div>

            {loading && campaigns.length === 0 ? (
                <div className="p-20 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-10 h-10 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin mx-auto mb-4"></div>
                    Loading mission data...
                </div>
            ) : error ? (
                <div className="p-10 text-center text-red-400 bg-white/5 rounded-2xl border border-white/10">{error}</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {campaigns.map((campaign) => (
                        <div key={campaign.id} className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden group hover:border-saffron/30 transition-all flex flex-col">
                            <div className="h-40 relative">
                                <img src={campaign.image_url || '/placeholder-banner.jpg'} alt={campaign.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        campaign.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                                        campaign.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                    }`}>
                                        {campaign.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-2">{campaign.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{campaign.short_description}</p>
                                
                                <div className="space-y-4 mt-auto">
                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                            <span className="text-gray-400">Progress</span>
                                            <span className="text-saffron">₹{campaign.current_amount} / ₹{campaign.goal_amount}</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <div 
                                                className="h-full bg-saffron transition-all duration-1000 shadow-[0_0_10px_rgba(255,153,51,0.5)]" 
                                                style={{ width: `${Math.min(100, (campaign.current_amount / campaign.goal_amount) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <button 
                                            onClick={() => handleEdit(campaign)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-saffron/10 hover:bg-saffron text-saffron hover:text-white text-xs font-bold rounded-xl transition-all border border-saffron/20"
                                        >
                                            <PencilSimple size={16} /> Edit Campaign
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(campaign.id)}
                                            className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* INTEGRATED Campaign Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !submitting && setShowModal(false)}></div>
                    <div className="relative w-full max-w-4xl bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animation-scale-in max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Megaphone size={24} className="text-saffron" />
                                {editingCampaign ? 'Edit Campaign Mission' : 'Launch New Campaign'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 text-gray-500 hover:text-white transition-all"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left Side: Campaign Details */}
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="relative h-48 rounded-2xl border-2 border-dashed border-white/10 overflow-hidden group">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-2">
                                                <UploadSimple size={32} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Main Campaign Banner</span>
                                            </div>
                                        )}
                                        <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mission Title</label>
                                            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-saffron/50 outline-none" required />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Status</label>
                                            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-saffron/50 outline-none">
                                                <option value="active">Active</option>
                                                <option value="completed">Completed</option>
                                                <option value="paused">Paused</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Short Mission Blurb</label>
                                        <textarea rows="2" value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-saffron/50 outline-none resize-none" maxLength="150" />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Mission Description</label>
                                        <textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-saffron/50 outline-none resize-none" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-saffron uppercase tracking-widest ml-1">Milestone Goal (₹)</label>
                                            <input type="number" value={formData.goal_amount} onChange={(e) => setFormData({...formData, goal_amount: e.target.value})} className="w-full bg-saffron/5 border border-saffron/20 rounded-xl px-4 py-3 text-saffron font-bold focus:border-saffron outline-none" required />
                                        </div>
                                        {editingCampaign && (
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Balance (₹)</label>
                                                <input type="number" value={formData.current_amount} onChange={(e) => setFormData({...formData, current_amount: e.target.value})} className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-gray-300 outline-none" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Contribution Items */}
                                <div className="lg:col-span-5 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                            <ShoppingCart size={18} className="text-saffron" /> 
                                            Mission Items
                                        </h3>
                                        <button 
                                            type="button" 
                                            onClick={handleAddFormItem}
                                            className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-saffron border border-saffron/20 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                                        >
                                            + Add Item
                                        </button>
                                    </div>

                                    <div className="flex-1 space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
                                        {formItems.length === 0 ? (
                                            <div className="p-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl border-dashed">
                                                <ImageIcon size={32} className="mx-auto text-gray-700 mb-2" />
                                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">No Items Defined</p>
                                                <p className="text-[9px] text-gray-700 mt-1 italic">Add specific items like grass, meals, or medicine icons.</p>
                                            </div>
                                        ) : (
                                            formItems.map((item, index) => (
                                                <div key={index} className="bg-white/5 p-4 rounded-2xl border border-white/10 relative group-item">
                                                    <button 
                                                        type="button"
                                                        onClick={() => item.id ? handleDeleteItem(item.id) : handleRemoveFormItem(index)}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-item-hover:opacity-100 transition-opacity z-10 shadow-lg"
                                                    >
                                                        <Trash size={12} weight="bold" />
                                                    </button>
                                                    <div className="flex gap-4">
                                                        <div className="w-16 h-16 rounded-xl border border-white/10 bg-black/20 flex-shrink-0 relative overflow-hidden group-icon">
                                                            {item.preview ? (
                                                                <img src={item.preview} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                                                                    <ImageIcon size={20} />
                                                                </div>
                                                            )}
                                                            {!item.id && (
                                                                <input 
                                                                    type="file" 
                                                                    onChange={(e) => handleItemImageChange(index, e.target.files[0])}
                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <input 
                                                                type="text" 
                                                                placeholder="Item Name" 
                                                                value={item.item_name}
                                                                disabled={!!item.id}
                                                                onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-saffron/50"
                                                            />
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input 
                                                                    type="number" 
                                                                    placeholder="Price ₹" 
                                                                    value={item.price_per_unit}
                                                                    disabled={!!item.id}
                                                                    onChange={(e) => handleItemChange(index, 'price_per_unit', e.target.value)}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-saffron/50"
                                                                />
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="Unit" 
                                                                    value={item.unit_name}
                                                                    disabled={!!item.id}
                                                                    onChange={(e) => handleItemChange(index, 'unit_name', e.target.value)}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-saffron/50"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={submitting} className="w-full bg-saffron hover:bg-saffron/90 text-white font-bold py-5 rounded-[24px] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95">
                                {submitting ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : (editingCampaign ? 'Synchronize Mission & Items' : 'Launch New Welfare Campaign')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCampaigns;

