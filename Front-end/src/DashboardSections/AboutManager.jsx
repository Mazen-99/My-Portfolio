import React, { useState, useEffect } from 'react';
import { updateAbout } from '../api/aboutApi';
import { uploadCV, deleteCV } from '../api/cvApi';
import { FaPlus, FaTrash, FaUpload, FaFilePdf, FaUser, FaPhone, FaEnvelope, FaBriefcase, FaCode, FaSpinner, FaWhatsapp, FaLinkedin, FaFacebook, FaGithub, FaGlobe } from 'react-icons/fa';

import Toast from '../components/Toast';
import Modal from './Modal';

const AboutManager = ({ data, onSave, password }) => {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        titles: [''],
        bio: '',
        description: '',
        skills: [{ name: '', icon: '' }],
        cv: null,
        socials: {
            whatsapp: '',
            linkedin: '',
            facebook: '',
            github: ''
        },
        ...data
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [cvLoading, setCvLoading] = useState(false);
    const [cvDeleting, setCvDeleting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (data) {
            setForm({
                ...data,
                titles: data.titles?.length ? data.titles : [''],
                skills: data.skills?.length ? data.skills : [{ name: '', icon: '' }],
                socials: data.socials || {
                    whatsapp: '',
                    linkedin: '',
                    facebook: '',
                    github: ''
                }
            });
        }
    }, [data]);

    // Validation
    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.phone.trim()) newErrors.phone = "Phone is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        if (!form.bio.trim()) newErrors.bio = "Bio is required";
        if (!form.description.trim()) newErrors.description = "Description is required";

        const validTitles = form.titles.filter(t => t.trim() !== '');
        if (validTitles.length === 0) newErrors.titles = "At least one valid title is required";

        const validSkills = form.skills.filter(s => s.name.trim() !== '' && s.icon.trim() !== '');
        if (validSkills.length === 0) newErrors.skills = "At least one skill with name and icon is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // CV Handling
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setToast({ show: true, message: "Please upload a PDF file.", type: 'error' });
                return;
            }
            if (file.size > 20 * 1024 * 1024) {
                setToast({ show: true, message: "File too large. Max 20MB allowed.", type: 'error' });
                return;
            }

            setCvLoading(true);
            try {
                const response = await uploadCV(file, password);
                setForm({ ...form, cv: response.cv });
                setToast({ show: true, message: "CV uploaded and saved successfully!", type: 'success' });
            } catch (error) {
                setToast({ show: true, message: error.message || "Failed to upload CV", type: 'error' });
            } finally {
                setCvLoading(false);
            }
        }
    };

    const removeCV = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteCV = async () => {
        setCvDeleting(true);
        try {
            await deleteCV(password);
            setForm({ ...form, cv: null });
            setToast({ show: true, message: "CV deleted successfully!", type: 'success' });
        } catch (error) {
            setToast({ show: true, message: error.message || "Failed to delete CV", type: 'error' });
        } finally {
            setCvDeleting(false);
        }
    };

    // Titles Handling
    const handleTitleChange = (index, value) => {
        const newTitles = [...form.titles];
        newTitles[index] = value;
        setForm({ ...form, titles: newTitles });
        if (errors.titles) setErrors({ ...errors, titles: null });
    };

    const addTitle = () => setForm({ ...form, titles: [...form.titles, ''] });
    const removeTitle = (index) => {
        const newTitles = form.titles.filter((_, i) => i !== index);
        setForm({ ...form, titles: newTitles.length ? newTitles : [''] });
    };

    // Skills Handling
    const handleSkillChange = (index, field, value) => {
        const newSkills = [...form.skills];
        newSkills[index] = { ...newSkills[index], [field]: value };
        setForm({ ...form, skills: newSkills });
        if (errors.skills) setErrors({ ...errors, skills: null });
    };

    const addSkill = () => setForm({ ...form, skills: [...form.skills, { name: '', icon: '' }] });
    const removeSkill = (index) => {
        const newSkills = form.skills.filter((_, i) => i !== index);
        setForm({ ...form, skills: newSkills.length ? newSkills : [{ name: '', icon: '' }] });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!validate()) {
            setToast({ show: true, message: "Please fix the errors before saving.", type: 'error' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setSaving(true);
        try {
            const cleanedForm = {
                ...form,
                titles: form.titles.filter(t => t.trim() !== ''),
                skills: form.skills.filter(s => s.name.trim() !== '' && s.icon.trim() !== '')
            };
            await updateAbout(cleanedForm, password);
            await onSave();
            setToast({ show: true, message: "Profile settings updated successfully!", type: 'success' });
        } catch (err) {
            setToast({ show: true, message: err.message || "Failed to update profile", type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            {/* 1. CV Section */}
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                        <FaFilePdf /> Curriculum Vitae (CV)
                    </label>
                    {form.cv && (
                        <button
                            type="button"
                            onClick={removeCV}
                            disabled={cvDeleting}
                            className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                        >
                            {cvDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash size={12} />}
                            {cvDeleting ? 'Deleting...' : 'Remove CV'}
                        </button>
                    )}
                </div>
                {!form.cv ? (
                    <div className="relative group">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            disabled={cvLoading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                        />
                        <div className={`border-2 border-dashed border-white/10 group-hover:border-primary/50 transition-all rounded-2xl p-8 text-center bg-black/20 ${cvLoading ? 'opacity-50' : ''}`}>
                            {cvLoading ? (
                                <FaSpinner className="mx-auto text-3xl text-primary animate-spin mb-2" />
                            ) : (
                                <FaUpload className="mx-auto text-3xl text-gray-500 mb-2 group-hover:text-primary transition-colors" />
                            )}
                            <p className="text-gray-400 text-sm">
                                {cvLoading ? 'Uploading CV to Server...' : 'Click or drag PDF to upload CV'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 bg-green-500/10 p-4 rounded-2xl border border-green-500/20">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                            <FaFilePdf />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium text-sm">CV Globally Available</p>
                            <p className="text-gray-400 text-xs truncate max-w-[200px] md:max-w-md">{form.cv}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 2. Basic Info */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <FaUser /> Full Name
                            </label>
                            {errors.name && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.name}</span>}
                        </div>
                        <input
                            className={`w-full bg-black/40 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} p-4 rounded-2xl focus:border-primary/50 focus:outline-none transition text-white`}
                            value={form.name || ''}
                            onChange={e => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: null }) }}
                            placeholder="e.g. Mahmoud Zaki"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <FaPhone /> Phone
                                </label>
                                {errors.phone && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.phone}</span>}
                            </div>
                            <input
                                className={`w-full bg-black/40 border ${errors.phone ? 'border-red-500/50' : 'border-white/10'} p-4 rounded-2xl focus:border-primary/50 focus:outline-none transition text-white text-sm`}
                                value={form.phone || ''}
                                onChange={e => { setForm({ ...form, phone: e.target.value }); if (errors.phone) setErrors({ ...errors, phone: null }) }}
                                placeholder="+20 100..."
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <FaEnvelope /> Email
                                </label>
                                {errors.email && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.email}</span>}
                            </div>
                            <input
                                className={`w-full bg-black/40 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} p-4 rounded-2xl focus:border-primary/50 focus:outline-none transition text-white text-sm`}
                                value={form.email || ''}
                                onChange={e => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: null }) }}
                                placeholder="hello@example.com"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Titles Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <FaBriefcase /> Professional Titles
                        </label>
                        {errors.titles && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.titles}</span>}
                    </div>
                    <div className="space-y-3">
                        {form.titles.map((title, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    className={`flex-1 bg-black/40 border ${errors.titles ? 'border-red-500/50' : 'border-white/10'} p-4 rounded-2xl focus:border-primary/50 focus:outline-none transition text-white text-sm`}
                                    value={title}
                                    onChange={e => handleTitleChange(index, e.target.value)}
                                    placeholder="e.g. MERN Stack Developer"
                                />
                                {form.titles.length > 1 && (
                                    <button type="button" onClick={() => removeTitle(index)} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition cursor-pointer">
                                        <FaTrash size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addTitle} className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-gray-500 hover:border-primary hover:text-primary transition flex items-center justify-center gap-2 text-sm cursor-pointer">
                            <FaPlus size={12} /> Add more titles
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Connect & Social Media */}
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6">
                <label className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-2">
                    <FaGlobe /> Connect & Social Media
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <FaWhatsapp className="text-green-500" /> WhatsApp (Phone Number)
                        </label>
                        <input
                            className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-primary/50 focus:outline-none transition text-white text-sm"
                            value={form.socials?.whatsapp || ''}
                            onChange={e => setForm({ ...form, socials: { ...form.socials, whatsapp: e.target.value } })}
                            placeholder="e.g. +201012345678"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <FaLinkedin className="text-blue-500" /> LinkedIn Profile URL
                        </label>
                        <input
                            className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-primary/50 focus:outline-none transition text-white text-sm"
                            value={form.socials?.linkedin || ''}
                            onChange={e => setForm({ ...form, socials: { ...form.socials, linkedin: e.target.value } })}
                            placeholder="https://linkedin.com/in/username"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <FaFacebook className="text-blue-600" /> Facebook Profile URL
                        </label>
                        <input
                            className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-primary/50 focus:outline-none transition text-white text-sm"
                            value={form.socials?.facebook || ''}
                            onChange={e => setForm({ ...form, socials: { ...form.socials, facebook: e.target.value } })}
                            placeholder="https://facebook.com/username"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <FaGithub className="text-white" /> GitHub Profile URL
                        </label>
                        <input
                            className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-primary/50 focus:outline-none transition text-white text-sm"
                            value={form.socials?.github || ''}
                            onChange={e => setForm({ ...form, socials: { ...form.socials, github: e.target.value } })}
                            placeholder="https://github.com/username"
                        />
                    </div>
                </div>
            </div>

            {/* 4. Bio Section */}
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Short Bio (One Liner)</label>
                    {errors.bio && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.bio}</span>}
                </div>
                <input
                    className={`w-full bg-black/40 border ${errors.bio ? 'border-red-500/50' : 'border-white/10'} p-4 rounded-2xl focus:border-primary/50 focus:outline-none transition text-white`}
                    value={form.bio || ''}
                    onChange={e => { setForm({ ...form, bio: e.target.value }); if (errors.bio) setErrors({ ...errors, bio: null }) }}
                    placeholder="Brief headline for your profile..."
                />
            </div>

            {/* 5. Description Section */}
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Detailed Description</label>
                    {errors.description && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.description}</span>}
                </div>
                <textarea
                    className={`w-full bg-black/40 border ${errors.description ? 'border-red-500/50' : 'border-white/10'} p-4 rounded-2xl h-40 focus:border-primary/50 focus:outline-none transition text-white resize-none`}
                    value={form.description || ''}
                    onChange={e => { setForm({ ...form, description: e.target.value }); if (errors.description) setErrors({ ...errors, description: null }) }}
                    placeholder="Tell more about your professional journey..."
                />
            </div>

            {/* 6. Skills Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <FaCode /> Core Technology Skills
                    </label>
                    {errors.skills && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.skills}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {form.skills.map((skill, index) => (
                        <div key={index} className={`bg-black/20 border ${errors.skills ? 'border-red-500/50' : 'border-white/5'} p-4 rounded-2xl space-y-3 relative group`}>
                            <input
                                className="w-full bg-black/40 border border-white/10 p-2 rounded-xl focus:border-primary/50 focus:outline-none transition text-white text-xs"
                                value={skill.name}
                                onChange={e => handleSkillChange(index, 'name', e.target.value)}
                                placeholder="Skill Name (e.g. React)"
                            />
                            <input
                                className="w-full bg-black/40 border border-white/10 p-2 rounded-xl focus:border-primary/50 focus:outline-none transition text-white text-xs"
                                value={skill.icon}
                                onChange={e => handleSkillChange(index, 'icon', e.target.value)}
                                placeholder="Icon Name (FontAwesome)"
                            />
                            {form.skills.length > 1 && (
                                <button type="button" onClick={() => removeSkill(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg cursor-pointer">
                                    <FaTrash size={10} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addSkill} className="aspect-square border-2 border-dashed border-white/5 rounded-2xl text-gray-600 hover:border-primary hover:text-primary transition-all duration-300 flex flex-col items-center justify-center gap-2 bg-white/2 cursor-pointer">
                        <FaPlus size={24} />
                        <span className="text-[10px] font-bold uppercase">Add Skill</span>
                    </button>
                </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-end">
                <button
                    disabled={saving}
                    className="bg-primary hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                    {saving ? 'Synchronizing Data...' : 'Commit All Changes'}
                </button>
            </div>
            {/* Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                title="Erase Curriculum Vitae"
                message="This will permanently delete your CV from the database and storage. This action is irreversible. Are you absolutely sure?"
                onConfirm={confirmDeleteCV}
                onClose={() => setShowDeleteModal(false)}
                type="danger"
                confirmText="ERASE PERMANENTLY"
                cancelText="KEEP MY CV"
            />
        </form>
    );
};

export default AboutManager;
