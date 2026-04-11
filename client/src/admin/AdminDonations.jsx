import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  HandHeart, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  CurrencyInr, 
  Megaphone,
  Fingerprint,
  Funnel,
  ArrowClockwise
} from '@phosphor-icons/react';

const AdminDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch('/api/admin/donations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch donations');
            const data = await res.json();
            setDonations(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        setProcessingId(id);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`/api/admin/donations/${id}/status`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error('Update failed');
            
            // Refresh list to see updated campaign progress if needed
            fetchDonations();
        } catch (err) {
            alert(err.message);
        } finally {
            setProcessingId(null);
        }
    };

    const filteredDonations = donations.filter(d => {
        if (filter === 'all') return true;
        return d.status === filter;
    });

    const stats = {
        pending: donations.filter(d => d.status === 'pending').length,
        total: donations.reduce((acc, d) => d.status === 'approved' ? acc + parseFloat(d.amount) : acc, 0)
    };

    return (
        <div className="space-y-6">
            <Helmet>
                <title>Verify Donations | Admin Dashboard</title>
            </Helmet>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <HandHeart size={28} className="text-saffron" weight="duotone" />
                        Donation Verification
                    </h1>
                    <p className="text-gray-500 mt-1">Review donor transaction IDs and approve contributions to update mission progress.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-right">Total Approved</p>
                        <p className="text-xl font-bold text-green-400">₹{stats.total.toLocaleString()}</p>
                    </div>
                    <button 
                        onClick={fetchDonations}
                        className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all border border-white/5"
                    >
                        <ArrowClockwise size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Filters & Stats Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 bg-[#222] px-3 py-1.5 rounded-xl border border-white/10">
                    <Funnel size={16} className="text-gray-500" />
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent text-xs font-bold text-gray-300 outline-none pr-2"
                    >
                        <option value="all">All Submissions</option>
                        <option value="pending">Pending Verification</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                
                <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stats.pending} Pending</span>
                    </div>
                </div>
            </div>

            {loading && donations.length === 0 ? (
                <div className="p-20 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-10 h-10 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin mx-auto mb-4"></div>
                    Loading donation history...
                </div>
            ) : filteredDonations.length === 0 ? (
                <div className="p-20 text-center bg-white/5 rounded-2xl border border-white/10">
                    <HandHeart size={48} className="mx-auto text-gray-700 mb-4" weight="light" />
                    <p className="text-gray-500">No donations matches the current filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredDonations.map((donation) => (
                        <div key={donation.id} className="bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col md:flex-row md:items-center gap-6 group hover:border-white/20 transition-all">
                            
                            {/* Donor Info */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-saffron/10 flex items-center justify-center text-saffron">
                                        <User size={18} />
                                    </div>
                                    <h3 className="text-white font-bold">{donation.donor_name}</h3>
                                    <span className={`ml-2 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                                        donation.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                                        donation.status === 'rejected' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 
                                        'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                                    }`}>
                                        {donation.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Megaphone size={14} className="text-gray-600" />
                                        <span className="text-xs truncate max-w-[150px]">{donation.campaign_title || 'General Donation'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Clock size={14} className="text-gray-600" />
                                        <span className="text-[10px] font-mono">{new Date(donation.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="flex-[1.5] bg-black/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/5 relative group/proof">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Transaction / UTR ID</p>
                                    <div className="flex items-center gap-2 text-saffron font-mono text-sm font-bold">
                                        <Fingerprint size={16} />
                                        {donation.transaction_id || 'NOT PROVIDED'}
                                    </div>
                                    {donation.proof_image_url && (
                                        <a 
                                            href={donation.proof_image_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-[10px] bg-white/10 hover:bg-saffron hover:text-white text-gray-400 px-2 py-1 rounded-lg transition-all mt-2 font-bold"
                                        >
                                            <ArrowClockwise size={12} weight="bold" className="hidden" /> {/* Placeholder icon check */}
                                            <p className="uppercase tracking-widest">View Attachment Proof</p>
                                        </a>
                                    )}
                                </div>
                                
                                {donation.proof_image_url && (
                                    <div className="hidden sm:block">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                                            <img 
                                                src={donation.proof_image_url} 
                                                className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity cursor-zoom-in" 
                                                onClick={() => window.open(donation.proof_image_url, '_blank')}
                                                alt="Proof"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="text-right">
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Amount Contributed</p>
                                    <p className="text-2xl font-bold text-white tracking-tighter flex items-center justify-end">
                                        <CurrencyInr size={20} className="text-gray-500" />
                                        {donation.amount}
                                    </p>
                                </div>
                            </div>

                            {/* Verification Actions */}
                            <div className="flex items-center gap-2">
                                {donation.status !== 'approved' && (
                                    <button 
                                        disabled={processingId === donation.id}
                                        onClick={() => handleStatusUpdate(donation.id, 'approved')}
                                        className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-green-500/20"
                                    >
                                        <CheckCircle size={18} weight="bold" /> Approve
                                    </button>
                                )}
                                {donation.status !== 'rejected' && (
                                    <button 
                                        disabled={processingId === donation.id}
                                        onClick={() => handleStatusUpdate(donation.id, 'rejected')}
                                        className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-red-500/20"
                                    >
                                        <XCircle size={18} weight="bold" /> Reject
                                    </button>
                                )}
                                {processingId === donation.id && (
                                    <div className="w-5 h-5 border-2 border-saffron/20 border-t-saffron rounded-full animate-spin"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDonations;
