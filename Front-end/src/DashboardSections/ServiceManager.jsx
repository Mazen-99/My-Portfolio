import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaRocket, FaCode } from 'react-icons/fa';
import { createService, updateService, deleteService } from '../api/serviceApi';
import Toast from '../components/Toast';
import Modal from './Modal';
import DynamicIcon from '../components/DynamicIcon';

const ServiceManager = ({ services, onSave, password }) => {
    const [loading, setLoading] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', icon: 'FaCode', order: 0 });
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    const handleOpenForm = (service = null) => {
        if (service) {
            setEditingService(service);
            setForm(service);
        } else {
            setEditingService(null);
            setForm({ title: '', description: '', icon: 'FaCode', order: services.length });
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingService(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingService) {
                await updateService(editingService._id, form, password);
                setToast({ show: true, message: 'Service updated successfully!', type: 'success' });
            } else {
                await createService(form, password);
                setToast({ show: true, message: 'New service forged successfully!', type: 'success' });
            }
            await onSave();
            handleCloseForm();
        } catch (err) {
            setToast({ show: true, message: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!serviceToDelete) return;
        setLoading(true);
        try {
            await deleteService(serviceToDelete._id, password);
            setToast({ show: true, message: 'Service removed from library', type: 'success' });
            await onSave();
            setShowDeleteModal(false);
        } catch (err) {
            setToast({ show: true, message: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                <div>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <FaRocket className="text-primary" /> Service Ecosystem
                    </h3>
                    <p className="text-description text-sm">Manage the professional solutions you provide.</p>
                </div>
                {!isFormOpen && (
                    <button
                        onClick={() => handleOpenForm()}
                        className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                    >
                        <FaPlus /> Deploy New Service
                    </button>
                )}
            </div>

            {isFormOpen ? (
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 animate-in zoom-in-95 duration-300">
                    <h4 className="text-xl font-bold mb-8 text-primary uppercase tracking-widest px-1">
                        {editingService ? 'Refining Service' : 'Forging New Service'}
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Service Title</label>
                                <input
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g., Full Stack Development"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Icon Identity</label>
                                <div className="flex gap-4">
                                    <input
                                        className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition font-mono"
                                        value={form.icon}
                                        onChange={e => setForm({ ...form, icon: e.target.value })}
                                        placeholder="e.g., FaCode"
                                        required
                                    />
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                                        <DynamicIcon name={form.icon} size={24} />
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1 px-1 italic">Use React-Icons Name (e.g., FaNodeJs, SiReact)</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Service Description</label>
                            <textarea
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition h-32 resize-none"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="Describe the value you provide..."
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={handleCloseForm}
                                className="px-8 py-4 rounded-xl font-bold text-gray-400 hover:text-white transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-orange-600 text-white px-12 py-4 rounded-2xl font-black transition disabled:opacity-50 cursor-pointer flex items-center gap-3 shadow-lg shadow-primary/20"
                            >
                                {loading ? <FaSpinner className="animate-spin" /> : <FaRocket />}
                                {editingService ? 'COMMIT UPDATES' : 'LAUNCH SERVICE'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service) => (
                        <div key={service._id} className="group bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-primary/40 transition duration-500 flex items-start gap-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 transition group-hover:scale-110">
                                <DynamicIcon name={service.icon} size={32} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2 text-white">
                                    <h4 className="font-bold text-lg truncate pr-4">{service.title}</h4>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenForm(service)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-primary transition cursor-pointer"><FaEdit size={14} /></button>
                                        <button onClick={() => { setServiceToDelete(service); setShowDeleteModal(true); }} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition cursor-pointer"><FaTrash size={14} /></button>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{service.description}</p>
                            </div>
                        </div>
                    ))}
                    {services.length === 0 && (
                        <div className="col-span-full border-2 border-dashed border-white/5 rounded-3xl py-20 flex flex-col items-center justify-center text-gray-500 italic">
                            No services active in the ecosystem...
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Decommission Service?"
                message={`Are you sure you want to remove the "${serviceToDelete?.title}" service? this action cannot be reversed.`}
                confirmText="DELETE"
                type="danger"
            />
        </div>
    );
};

export default ServiceManager;
