import React, { useState, useEffect } from 'react';
import { getVisitors, deleteVisitor, deleteAllVisitors } from '../api/adminApi';
import { FaUsers, FaClock, FaDesktop, FaTrash, FaCheck, FaTimes, FaShieldAlt } from 'react-icons/fa';
import Modal from './Modal';
import Toast from '../components/Toast';

const VisitorsManager = ({ adminPassword }) => {
    const [visitors, setVisitors] = useState([]);
    const [currentIp, setCurrentIp] = useState('');
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [showClearModal, setShowClearModal] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const fetchVisitors = async () => {
        try {
            const data = await getVisitors(adminPassword);
            setVisitors(data.visitors || []);
            setCurrentIp(data.currentIp || '');
        } catch (error) {
            console.error('Failed to fetch visitors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
        const interval = setInterval(fetchVisitors, 45000); // 45s refresh
        return () => clearInterval(interval);
    }, [adminPassword]);

    const handleDeleteVisitor = async (id) => {
        setDeletingId(id);
        try {
            await deleteVisitor(id, adminPassword);
            setVisitors(visitors.filter(v => v._id !== id));
            setToast({ show: true, message: 'Visitor record deleted.', type: 'success' });
        } catch (error) {
            setToast({ show: true, message: 'Failed to delete record.', type: 'error' });
        } finally {
            setDeletingId(null);
        }
    };

    const handleClearAll = async () => {
        try {
            await deleteAllVisitors(adminPassword);
            setVisitors([]);
            setToast({ show: true, message: 'All logs cleared.', type: 'success' });
        } catch (error) {
            setToast({ show: true, message: 'Failed to clear logs.', type: 'error' });
        } finally {
            setShowClearModal(false);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        
        // Date part: YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        // Time part: HH:MM:SS
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}:${seconds}`
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black text-headline tracking-tighter uppercase italic flex items-center gap-4">
                        <FaUsers className="text-primary not-italic" />
                        AUDIENCE <span className="text-primary">LOGS</span>
                    </h2>
                    <p className="text-description mt-2 font-medium tracking-tight">Granular site engagement metrics and visitor entry points.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="bg-section-secondary px-6 py-4 rounded-3xl border border-white/5 shadow-inner hidden sm:block">
                        <span className="text-description text-[10px] uppercase tracking-[0.2em] font-black block mb-1">Live Sessions</span>
                        <span className="text-primary font-black text-2xl">{visitors.length}</span>
                    </div>
                    {visitors.length > 0 && (
                        <button 
                            onClick={() => setShowClearModal(true)}
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-4 rounded-2xl border border-red-500/20 transition-all duration-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                        >
                            <FaTrash size={12} /> Clear History
                        </button>
                    )}
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-section-secondary/40 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-section-primary/60 text-description uppercase text-[10px] tracking-[0.25em] font-black border-b border-white/5">
                                <th className="px-10 py-7">Status</th>
                                <th className="px-10 py-7">Origin Address (IP)</th>
                                <th className="px-10 py-7 hidden md:table-cell">Device Cluster</th>
                                <th className="px-10 py-7">Entry Chronology</th>
                                <th className="px-10 py-7 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/2">
                            {visitors.map((visitor, idx) => {
                                const dt = formatDateTime(visitor.timestamp);
                                return (
                                    <tr 
                                        key={visitor._id} 
                                        className="hover:bg-white/2 transition-colors group duration-500"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    (new Date() - new Date(visitor.timestamp)) < 15 * 60 * 1000 
                                                    ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
                                                    : 'bg-slate-700/50'
                                                }`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                    (new Date() - new Date(visitor.timestamp)) < 15 * 60 * 1000 
                                                    ? 'text-green-500' 
                                                    : 'text-description opacity-40'
                                                }`}>
                                                    {(new Date() - new Date(visitor.timestamp)) < 15 * 60 * 1000 ? 'Live' : 'Offline'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-headline font-bold text-lg tracking-tight select-all">
                                                        {visitor.ip}
                                                    </span>
                                                    {visitor.ip === currentIp && (
                                                        <span className="bg-primary text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-lg shadow-primary/20">
                                                            ME
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 hidden md:table-cell">
                                            <div className="flex items-center gap-3 text-description text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                                                <FaDesktop />
                                                <span className="truncate max-w-[180px]">
                                                    {visitor.userAgent?.split(') ')[0]?.split(' (')[1]?.split(';')[0] || 'Unknown Node'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="font-mono flex flex-col gap-1 group-hover:text-primary transition-colors duration-500">
                                                <span className="text-headline text-sm font-black tracking-tight">{dt.date}</span>
                                                <span className="text-description text-xs font-bold opacity-60">{dt.time}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button 
                                                onClick={() => handleDeleteVisitor(visitor._id)}
                                                disabled={deletingId === visitor._id}
                                                className="p-4 bg-white/2 hover:bg-red-500/20 text-description hover:text-red-500 rounded-2xl transition-all duration-300 disabled:opacity-50 cursor-pointer"
                                                title="Eliminate Entry"
                                            >
                                                {deletingId === visitor._id ? (
                                                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <FaTrash size={16} />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {visitors.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center text-description italic font-bold tracking-widest opacity-20 uppercase">
                                        End of logs. No active metrics recorded.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Clear All Modal */}
            <Modal
                isOpen={showClearModal}
                title="Wipe Analytics History"
                message="Are you absolutely sure you want to permanently delete all visitor records? This will reset all session data and is irreversible."
                onConfirm={handleClearAll}
                onClose={() => setShowClearModal(false)}
                type="danger"
                confirmText="RESET ALL LOGS"
                cancelText="KEEP DATA"
            />
        </div>
    );
};

export default VisitorsManager;
