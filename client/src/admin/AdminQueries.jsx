import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Envelope, CaretDown, CaretUp, MapPinLine, Checks } from '@phosphor-icons/react';

const AdminQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/queries', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch queries');
      }

      const data = await response.json();
      setQueries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const markAsResolved = async (id) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/queries/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Resolved' })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to update status');
      }

      setQueries(queries.map(q => q.id === id ? { ...q, status: 'Resolved' } : q));
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Contact Queries | Admin Dashboard</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Envelope size={28} className="text-[#f26522]" weight="duotone" />
          Contact Inquiries
        </h1>
        <p className="text-gray-500 mt-1">Review and manage incoming messages from the public website.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-[#f26522] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading inquiries...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 bg-red-50/50">
            <p className="font-semibold">Error loading data</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : queries.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Envelope size={48} className="mx-auto text-gray-300 mb-4" weight="light" />
            <p className="text-lg font-medium">No inquiries found.</p>
            <p className="text-sm">When someone submits a contact form, it will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100/80">
                  <th className="p-4 font-semibold text-gray-600 text-sm w-1/4">Name & Email</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm hidden md:table-cell">Location</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm w-1/3">Subject</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm text-right w-1/5">Date Received</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm text-center w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {queries.map((query) => (
                  <React.Fragment key={query.id}>
                    <tr 
                      className={`hover:bg-orange-50/30 transition-colors cursor-pointer ${expandedRow === query.id ? 'bg-orange-50/50' : ''}`}
                      onClick={() => toggleRow(query.id)}
                    >
                      <td className="p-4">
                        <div className="font-medium text-gray-800">{query.name}</div>
                        <div className="text-sm text-gray-500">{query.email}</div>
                        {query.phone && <div className="text-xs text-gray-400 mt-0.5">{query.phone}</div>}
                      </td>
                      <td className="p-4 hidden md:table-cell align-top pt-5">
                        <div className="flex items-start gap-1 text-sm text-gray-600">
                          <MapPinLine size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="truncate max-w-[150px]">
                            {[query.city, query.state, query.country].filter(Boolean).join(', ') || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-top pt-5">
                        <div className="font-medium text-gray-700 truncate max-w-xs">{query.subject || 'No Subject'}</div>
                        <div className={`text-xs font-mono mt-1 w-max px-2 py-0.5 rounded-md ${query.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-[#f26522]'}`}>
                           {query.status}
                        </div>
                      </td>
                      <td className="p-4 text-right align-top pt-5">
                        <span className="text-sm text-gray-500">{formatDate(query.created_at)}</span>
                      </td>
                      <td className="p-4 text-center align-top pt-5">
                        <button className="text-gray-400 hover:text-[#f26522] transition-colors p-1 rounded-full hover:bg-orange-100">
                          {expandedRow === query.id ? <CaretUp size={20} /> : <CaretDown size={20} />}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Detail Row */}
                    {expandedRow === query.id && (
                      <tr className="bg-orange-50/20 border-b-2 border-orange-100/50">
                        <td colSpan="5" className="p-0">
                          <div className="p-6 md:p-8 animate-fadeIn">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f26522] mb-3">Full Message</h4>
                            <div className="bg-white p-5 border border-orange-100/70 rounded-xl shadow-sm text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                              {query.message}
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                                <button 
                                  onClick={() => markAsResolved(query.id)}
                                  disabled={query.status === 'Resolved'}
                                  className={`flex items-center gap-2 text-sm px-4 py-2 border rounded-lg transition-colors ${
                                    query.status === 'Resolved' 
                                      ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                                      : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 cursor-pointer'
                                  }`}
                                >
                                  <Checks size={18} weight="bold" />
                                  {query.status === 'Resolved' ? 'Resolved' : 'Mark as Resolved'}
                                </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQueries;
