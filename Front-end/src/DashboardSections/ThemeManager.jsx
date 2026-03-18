import React, { useState, useEffect } from 'react';
import { FaPalette, FaRocket, FaSpinner } from 'react-icons/fa';
import { setTheme } from '../api/themeApi';
import Toast from '../components/Toast';

const ThemeManager = ({ data, onSave, password }) => {
    const [form, setForm] = useState({
        primary: '#f97316',
        headline: '#ffffff',
        description: '#94a3b8',
        primarySection: '#0f172a',
        secondarySection: '#1e293b',
        ...data
    });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        if (data) setForm(prev => ({ ...prev, ...data }));
    }, [data]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setTheme(form, password);
            setToast({ show: true, message: 'Visual Identity forged successfully!', type: 'success' });
            onSave();
        } catch (err) {
            setToast({ show: true, message: err.message || 'Failed to update theme', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const ColorInput = ({ label, dbField, value, onChange }) => (
        <div className="space-y-4 group">
            <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">{label}</label>
                <span className="text-[10px] font-mono text-gray-600 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">{dbField}</span>
            </div>
            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-3xl border border-white/10 group-hover:border-primary/40 transition duration-500 hover:bg-black/60 shadow-inner">
                <div className="relative flex-shrink-0">
                    <input
                        type="color"
                        className="w-14 h-14 rounded-2xl bg-transparent cursor-pointer border-0 p-0 overflow-hidden"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-white/10 shadow-inner"></div>
                </div>
                <div className="flex-1 space-y-1">
                    <input
                        className="w-full bg-transparent border-0 p-0 font-mono text-xl focus:outline-none text-white tracking-wider uppercase"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                    />
                    <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
                </div>
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSave} className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-1000 pb-10">
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-3">
                        <FaPalette className="text-primary" /> Visual Identity
                    </h3>
                    <p className="text-description text-sm mt-1">Sculpt the professional aesthetic of your portfolio ecosystem.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <ColorInput
                    label="Accent Color"
                    dbField="primary"
                    value={form.primary}
                    onChange={val => setForm({ ...form, primary: val })}
                />
                <ColorInput
                    label="Title Color"
                    dbField="headline"
                    value={form.headline}
                    onChange={val => setForm({ ...form, headline: val })}
                />
                <ColorInput
                    label="Body Text"
                    dbField="description"
                    value={form.description}
                    onChange={val => setForm({ ...form, description: val })}
                />
                <ColorInput
                    label="Deep Background"
                    dbField="primarySection"
                    value={form.primarySection}
                    onChange={val => setForm({ ...form, primarySection: val })}
                />
                <ColorInput
                    label="Surface Background"
                    dbField="secondarySection"
                    value={form.secondarySection}
                    onChange={val => setForm({ ...form, secondarySection: val })}
                />
            </div>

            <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 border-dashed relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 text-primary/5 group-hover:text-primary/10 transition-colors duration-1000">
                    <FaPalette size={120} />
                </div>
                <div className="relative z-10 flex gap-6 items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                        <FaRocket />
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-1">Atmospheric Synchronization</h4>
                        <p className="text-description text-sm leading-relaxed max-w-2xl">
                            All adjustments made here will harmonize across your entire platform instantly.
                            Ensure high contrast ratios for readability and a premium professional feel.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    disabled={saving}
                    className="group relative bg-primary hover:bg-orange-600 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all duration-500 hover:shadow-[0_20px_50px_rgba(249,115,22,0.4)] disabled:opacity-50 cursor-pointer overflow-hidden"
                >
                    <div className="relative z-10 flex items-center gap-3">
                        {saving ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                <span>REMASTERING...</span>
                            </>
                        ) : (
                            <span>APPLY IDENTITY CHANGES</span>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
            </div>
        </form>
    );
};

export default ThemeManager;
