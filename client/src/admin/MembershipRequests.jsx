import { useState, useEffect } from 'react';
import { IdentificationCard, CheckCircle, XCircle, Trash, WarningCircle, Check, X, MagnifyingGlass, Funnel } from '@phosphor-icons/react';
import { useOutletContext } from 'react-router-dom';

export default function MembershipRequests() {
  const { admin } = useOutletContext();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'approved', 'rejected'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Image Modal state
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/members', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error('Failed to fetch membership requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/members/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      console.error('Update status error', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this membership request? This action cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/members/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        setRequests(requests.filter(req => req.id !== id));
      } else {
        alert('Failed to delete request.');
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'all' || req.status === filter;
    const searchRegex = new RegExp(searchTerm, 'i');
    const matchesSearch = searchRegex.test(req.name) || searchRegex.test(req.phone) || searchRegex.test(req.city);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-dark border border-white/5 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-saffron/20 text-saffron flex items-center justify-center">
              <IdentificationCard size={24} weight="fill" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Membership Requests</h1>
          </div>
          <p className="text-gray-400 text-sm max-w-2xl">Review and manage member applications. Verify their payment proof before approving their membership.</p>
        </div>

        <div className="relative z-10 flex gap-2 w-full md:w-auto">
           <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex items-center">
              {['all', 'pending', 'approved', 'rejected'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-saffron text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  {f}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center">
          <MagnifyingGlass size={20} className="absolute left-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by name, phone, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-saffron transition-all"
          />
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
            <div className="w-10 h-10 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin"></div>
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map(req => (
            <div key={req.id} className="bg-[#151515] rounded-3xl border border-white/5 overflow-hidden flex flex-col hover:border-white/10 transition-colors shadow-xl">
               
               <div className="p-6 flex-1 relative">
                  {/* Status Badge */}
                  <div className={`absolute top-6 right-6 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${
                    req.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                    req.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                    'bg-saffron/10 text-saffron border-saffron/20'
                  }`}>
                    {req.status}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 pr-20">{req.name}</h3>
                  <p className="text-saffron text-sm font-bold mb-4">{req.membership_type}</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                       <span className="text-gray-500">Phone</span>
                       <span className="text-white">{req.phone}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                       <span className="text-gray-500">Location</span>
                       <span className="text-white text-right">{req.city}, {req.state || 'N/A'}<br/>{req.country}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                       <span className="text-gray-500">Amount Paid</span>
                       <span className="text-white font-black">₹{req.amount}</span>
                    </div>
                  </div>

                  {req.proof_image_url && (
                    <button 
                      onClick={() => setSelectedImage(req.proof_image_url)}
                      className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl border border-white/10 transition-colors text-sm font-semibold"
                    >
                      <IdentificationCard size={18} /> View Payment Proof
                    </button>
                  )}
               </div>

               {/* Actions */}
               <div className="grid grid-cols-3 divide-x divide-white/5 border-t border-white/5 bg-black/20">
                  <button 
                    onClick={() => handleStatusUpdate(req.id, 'approved')}
                    disabled={req.status === 'approved'}
                    className={`p-4 flex flex-col items-center justify-center gap-1 transition-colors ${req.status === 'approved' ? 'text-green-500 bg-green-500/5' : 'text-gray-400 hover:text-green-400 hover:bg-white/5'}`}
                  >
                    <CheckCircle size={20} weight={req.status === 'approved' ? 'fill' : 'bold'} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Accept</span>
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(req.id, 'rejected')}
                    disabled={req.status === 'rejected'}
                    className={`p-4 flex flex-col items-center justify-center gap-1 transition-colors ${req.status === 'rejected' ? 'text-red-500 bg-red-500/5' : 'text-gray-400 hover:text-red-400 hover:bg-white/5'}`}
                  >
                    <XCircle size={20} weight={req.status === 'rejected' ? 'fill' : 'bold'} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Reject</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(req.id)}
                    className={`p-4 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors`}
                  >
                    <Trash size={20} weight="bold" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Delete</span>
                  </button>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#151515] border border-white/5 rounded-3xl p-16 text-center text-gray-400">
           <WarningCircle size={48} className="mx-auto mb-4 text-white/20" />
           <p className="text-lg">No membership requests found.</p>
           {searchTerm && <p className="text-sm mt-2">Try adjusting your search filters.</p>}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
           <div className="relative max-w-4xl max-h-screen">
             <button 
               className="absolute -top-12 right-0 text-white bg-white/10 hover:bg-red-500 p-2 rounded-full transition-colors"
               onClick={() => setSelectedImage(null)}
             >
               <X size={24} weight="bold" />
             </button>
             <img src={selectedImage} alt="Payment Proof" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
           </div>
        </div>
      )}

    </div>
  );
}
