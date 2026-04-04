import React, { useState, useEffect } from 'react';
import { FaPalette, FaRocket, FaSpinner, FaSun, FaMoon, FaHeading } from 'react-icons/fa';
import { setTheme } from '../api/themeApi';
import Toast from '../components/Toast';

const ThemeManager = ({ data, onSave, password }) => {
    const [form, setForm] = useState({
        primary: '#f97316',
        darkHeadline: '#ffffff',
        lightHeadline: '#0f172a',
        description: '#94a3b8',
        darkPrimarySection: '#0f172a',
        lightPrimarySection: '#f8fafc',
        darkSecondarySection: '#1e293b',
        lightSecondarySection: '#f1f5f9',
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
            setToast({ show: true, message: 'Comprehensive Visual Identity forged successfully!', type: 'success' });
            onSave();
        } catch (err) {
            setToast({ show: true, message: err.message || 'Failed to update theme', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const ColorInput = ({ label, dbField, value, onChange, icon }) => (
        <div className="space-y-4 group">
            <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-primary transition-colors flex items-center gap-2">
                    {icon} {label}
                </label>
                <span className="text-[10px] font-mono text-gray-600 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">{dbField}</span>
            </div>
            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-3xl border border-white/10 group-hover:border-primary/40 transition duration-500 hover:bg-black/60 shadow-inner">
                <div className="relative shrink-0">
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
                    <div className="h-px w-full bg-linear-to-r from-white/10 to-transparent"></div>
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
                    <h3 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tight">
                        <FaPalette className="text-primary" /> Visual Identity Ecosystem
                    </h3>
                    <p className="text-description text-sm mt-1">Sculpt modern aesthetics with separate identities for Dark and Light experiences.</p>
                </div>
            </div>

            {/* Core & Shared Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white/2 p-8 rounded-4xl border border-white/5">
                <ColorInput
                    label="Accent Color (Shared)"
                    dbField="primary"
                    value={form.primary}
                    onChange={val => setForm({ ...form, primary: val })}
                />
                <ColorInput
                    label="Body Text Color (Shared)"
                    dbField="description"
                    value={form.description}
                    onChange={val => setForm({ ...form, description: val })}
                />
            </div>

            {/* Title Colors (Dark vs Light) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <ColorInput 
                    icon={<FaHeading className="text-blue-500" />}
                    label="Dark Headline Text" 
                    dbField="darkHeadline" 
                    value={form.darkHeadline} 
                    onChange={val => setForm({ ...form, darkHeadline: val })} 
                />
                <ColorInput 
                    icon={<FaHeading className="text-yellow-500" />}
                    label="Light Headline Text" 
                    dbField="lightHeadline" 
                    value={form.lightHeadline} 
                    onChange={val => setForm({ ...form, lightHeadline: val })} 
                />
            </div>

            {/* Primary Sections (Dark vs Light) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <ColorInput 
                    icon={<FaMoon className="text-blue-500" />}
                    label="Dark Primary Section" 
                    dbField="darkPrimarySection" 
                    value={form.darkPrimarySection} 
                    onChange={val => setForm({ ...form, darkPrimarySection: val })} 
                />
                <ColorInput 
                    icon={<FaSun className="text-yellow-500" />}
                    label="Light Primary Section" 
                    dbField="lightPrimarySection" 
                    value={form.lightPrimarySection} 
                    onChange={val => setForm({ ...form, lightPrimarySection: val })} 
                />
            </div>

            {/* Secondary Sections (Dark vs Light) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <ColorInput 
                    icon={<FaMoon className="text-blue-500" />}
                    label="Dark Secondary Section" 
                    dbField="darkSecondarySection" 
                    value={form.darkSecondarySection} 
                    onChange={val => setForm({ ...form, darkSecondarySection: val })} 
                />
                <ColorInput 
                    icon={<FaSun className="text-yellow-500" />}
                    label="Light Secondary Section" 
                    dbField="lightSecondarySection" 
                    value={form.lightSecondarySection} 
                    onChange={val => setForm({ ...form, lightSecondarySection: val })} 
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
                        <h4 className="font-bold text-white mb-1 uppercase tracking-tight italic text-lg">Bi-Mode Synchronization Matrix</h4>
                        <p className="text-description text-sm leading-relaxed max-w-3xl">
                            All configurations here are live and synchronized across every visitor's device instantly. 
                            Users can switch between Dark and Light experiences; please ensure contrast ratios represent a high level of professionalism.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    disabled={saving}
                    className="group relative bg-primary hover:bg-orange-600 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all duration-500 hover:shadow-[0_20px_50px_rgba(249,115,22,0.4)] disabled:opacity-50 cursor-pointer overflow-hidden border-0"
                >
                    <div className="relative z-10 flex items-center gap-3">
                        {saving ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                <span>COMMITTING UNITY...</span>
                            </>
                        ) : (
                            <span>APPLY ALL IDENTITY CHANGES</span>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
            </div>
        </form>
    );
};

export default ThemeManager;
