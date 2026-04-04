import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/getCroppedImg';
import { FaPlus, FaTrash, FaUpload, FaLink, FaGithub, FaCode, FaTimes, FaSpinner, FaChevronLeft, FaBriefcase, FaCropAlt } from 'react-icons/fa';
import { deleteProject, createProject, updateProject } from '../api/projectApi';
import Toast from '../components/Toast';
import Modal from './Modal';
import DashboardProjectCard from './DashboardProjectCard';

const ProjectManager = ({ projects, onSave, password }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        liveUrl: '',
        githubUrl: '',
        techStack: [''],
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [modal, setModal] = useState({ show: false, title: '', message: '', onConfirm: null });

    // Cropper States
    const [showCropper, setShowCropper] = useState(false);
    const [rawImage, setRawImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleDeleteProject = async (id) => {
        try {
            await deleteProject(id, password);
            setToast({ show: true, message: "Project deleted successfully", type: 'success' });
            await onSave();
            setModal({ ...modal, show: false });
        } catch (e) {
            setToast({ show: true, message: e.message, type: 'error' });
        }
    };

    const handleEdit = (project) => {
        setCurrentProject(project);
        setForm({
            title: project.title,
            description: project.description,
            liveUrl: project.liveUrl || '',
            githubUrl: project.githubUrl || '',
            techStack: project.techStack.length ? project.techStack : [''],
            image: null
        });
        setImagePreview(project.image);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNewProject = () => {
        setCurrentProject(null);
        setForm({
            title: '',
            description: '',
            liveUrl: '',
            githubUrl: '',
            techStack: [''],
            image: null
        });
        setImagePreview(null);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = "Title is required";
        if (!form.description.trim()) newErrors.description = "Description is required";
        if (!isEditing && !form.image && !currentProject) newErrors.image = "Project image is required";

        const validTech = form.techStack.filter(t => t.trim() !== '');
        if (validTech.length === 0) newErrors.techStack = "At least one technology is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setToast({ show: true, message: "Image too large. Max 10MB allowed.", type: 'error' });
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setRawImage(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropConfirm = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(rawImage, croppedAreaPixels);
            const croppedFile = new File([croppedImageBlob], 'project-image.jpg', { type: 'image/jpeg' });

            setForm({ ...form, image: croppedFile });
            setImagePreview(URL.createObjectURL(croppedImageBlob));
            setShowCropper(false);
            setRawImage(null);
            setToast({ show: true, message: "Image cropped successfully!", type: 'success' });
        } catch (e) {
            console.error(e);
            setToast({ show: true, message: "Failed to crop image", type: 'error' });
        }
    };

    const handleTechChange = (index, value) => {
        const newTech = [...form.techStack];
        newTech[index] = value;
        setForm({ ...form, techStack: newTech });
        if (errors.techStack) setErrors({ ...errors, techStack: null });
    };

    const addTech = () => setForm({ ...form, techStack: [...form.techStack, ''] });
    const removeTech = (index) => {
        const newTech = form.techStack.filter((_, i) => i !== index);
        setForm({ ...form, techStack: newTech.length ? newTech : [''] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            setToast({ show: true, message: "Please check the form for errors.", type: 'error' });
            return;
        }

        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('liveUrl', form.liveUrl);
            formData.append('githubUrl', form.githubUrl);
            formData.append('techStack', JSON.stringify(form.techStack.filter(t => t.trim() !== '')));

            if (form.image) {
                formData.append('image', form.image);
            }

            if (currentProject) {
                await updateProject(currentProject._id, formData, password);
                setToast({ show: true, message: "Project updated successfully!", type: 'success' });
            } else {
                await createProject(formData, password);
                setToast({ show: true, message: "Project created successfully!", type: 'success' });
            }

            await onSave();
            setIsEditing(false);
        } catch (err) {
            setToast({ show: true, message: err.message || "Operation failed", type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (isEditing) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
                {toast.show && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast({ ...toast, show: false })}
                    />
                )}

                {/* Cropper Modal Overlay */}
                {showCropper && (
                    <div className="fixed inset-0 z-10000 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
                        <div className="w-full max-w-4xl aspect-video relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                            <Cropper
                                image={rawImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={16 / 9}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-md">
                            <div className="w-full space-y-2">
                                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    <span>Zoom Level</span>
                                    <span>{Math.round(zoom * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(e.target.value)}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={() => { setShowCropper(false); setRawImage(null); }}
                                    className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleCropConfirm}
                                    className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-orange-600 transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    <FaCropAlt /> CONFIRM CROP
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition cursor-pointer text-gray-400 hover:text-white"
                    >
                        <FaChevronLeft size={18} />
                    </button>
                    <div>
                        <h3 className="text-2xl font-bold">{currentProject ? 'Refine Project' : 'Enshrine New Project'}</h3>
                        <p className="text-description text-sm">Fill in the details to showcase your masterpiece.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pb-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Image Upload Area */}
                        <div className="lg:col-span-1 space-y-4">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                <FaUpload /> Project Banner
                            </label>
                            <div className="relative group aspect-video lg:aspect-square">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                {imagePreview ? (
                                    <div className="w-full h-full rounded-4xl overflow-hidden border border-white/10 relative shadow-2xl">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-sm">
                                            <div className="text-center">
                                                <FaCropAlt className="text-3xl text-primary mx-auto mb-2" />
                                                <p className="text-white font-bold text-sm">RE-UPLOAD & CROP</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`w-full h-full border-2 border-dashed ${errors.image ? 'border-red-500/40' : 'border-white/10'} rounded-4xl flex flex-col items-center justify-center bg-white/5 group-hover:border-primary/50 transition duration-500 text-center p-6 shadow-inner`}>
                                        <FaUpload className="text-3xl text-gray-500 mb-3 group-hover:text-primary transition-colors" />
                                        <p className="text-gray-400 text-sm font-medium">Click to upload banner</p>
                                        <p className="text-gray-600 text-[10px] uppercase tracking-tighter mt-1">Recommended: 16:9 Aspect Ratio</p>
                                    </div>
                                )}
                            </div>
                            {errors.image && <p className="text-[10px] text-red-500 font-bold uppercase text-center">{errors.image}</p>}
                        </div>

                        {/* Project Details Area */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Project Title</label>
                                    {errors.title && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.title}</span>}
                                </div>
                                <input
                                    className={`w-full bg-section-primary/20 border ${errors.title ? 'border-red-500/50' : 'border-white/5'} p-4 rounded-2xl focus:border-primary/40 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-headline font-bold duration-500 placeholder:text-description/30 shadow-inner`}
                                    value={form.title}
                                    onChange={e => { setForm({ ...form, title: e.target.value }); if (errors.title) setErrors({ ...errors, title: null }) }}
                                    placeholder="e.g. E-Commerce Vanguard"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Chronicle/Description</label>
                                    {errors.description && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.description}</span>}
                                </div>
                                <textarea
                                    className={`w-full bg-section-primary/20 border ${errors.description ? 'border-red-500/50' : 'border-white/5'} p-4 rounded-2xl h-40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-headline font-bold duration-500 placeholder:text-description/30 shadow-inner resize-none leading-relaxed`}
                                    value={form.description}
                                    onChange={e => { setForm({ ...form, description: e.target.value }); if (errors.description) setErrors({ ...errors, description: null }) }}
                                    placeholder="Describe the mission, challenges, and triumph of this project..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <FaLink /> Deployment URL
                                    </label>
                                    <input
                                        className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-primary/50 focus:outline-none transition text-white text-sm"
                                        value={form.liveUrl}
                                        onChange={e => setForm({ ...form, liveUrl: e.target.value })}
                                        placeholder="https://live-demo.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <FaGithub /> Repository Link
                                    </label>
                                    <input
                                        className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-primary/50 focus:outline-none transition text-white text-sm"
                                        value={form.githubUrl}
                                        onChange={e => setForm({ ...form, githubUrl: e.target.value })}
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack Section */}
                    <div className="bg-white/5 p-8 rounded-4xl border border-white/10 space-y-6">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                <FaCode /> Built With
                            </label>
                            {errors.techStack && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.techStack}</span>}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {form.techStack.map((tech, index) => (
                                <div key={index} className="flex gap-2 group relative">
                                    <input
                                        className={`w-full bg-black/40 border ${errors.techStack ? 'border-red-500/50' : 'border-white/10'} p-3 rounded-xl focus:border-primary/50 focus:outline-none transition text-white text-xs text-center font-bold`}
                                        value={tech}
                                        onChange={e => handleTechChange(index, e.target.value)}
                                        placeholder="e.g. React"
                                    />
                                    {form.techStack.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTech(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg cursor-pointer z-20"
                                        >
                                            <FaTimes size={10} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addTech}
                                className="border border-dashed border-white/10 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition flex flex-col items-center justify-center gap-1 hover:bg-white/5 cursor-pointer min-h-[46px]"
                            >
                                <FaPlus size={12} />
                                <span className="text-[10px] font-bold uppercase">Add Tool</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            disabled={saving}
                            className="bg-primary hover:bg-orange-600 text-white px-12 py-4 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center gap-3 overflow-hidden group relative"
                        >
                            <span className="relative z-10">{saving ? 'FORGING CHANGES...' : (currentProject ? 'COMMIT UPDATES' : 'ENSHRINE PROJECT')}</span>
                            {saving ? <FaSpinner className="animate-spin relative z-10" /> : <FaPlus className="group-hover:translate-x-1 transition-transform relative z-10" />}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

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
                    <h3 className="text-2xl font-bold">Showcase Library</h3>
                    <p className="text-description text-sm">Manage the projects displayed on your portfolio.</p>
                </div>
                <button
                    onClick={handleNewProject}
                    className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-white/90 transition shadow-lg cursor-pointer group"
                >
                    <FaPlus size={14} className="group-hover:rotate-90 transition-transform duration-300" /> NEW PROJECT
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 bg-white/2 rounded-4xl border border-dashed border-white/5 text-slate-500">
                    <div className="text-gray-600 mb-4 flex justify-center"><FaBriefcase size={40} /></div>
                    <p className="text-gray-500 font-medium">Your portfolio is a blank canvas.</p>
                    <button onClick={handleNewProject} className="text-primary hover:underline mt-2 font-bold cursor-pointer">Start by adding your first project</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto">
                    {projects.map(p => (
                        <DashboardProjectCard 
                            key={p._id} 
                            project={p} 
                            onEdit={handleEdit}
                            onDelete={(project) => {
                                setModal({
                                    show: true,
                                    title: "Erase Project",
                                    message: `Are you sure you want to permanently delete "${project.title}"? This action cannot be undone.`,
                                    onConfirm: () => handleDeleteProject(project._id)
                                });
                            }}
                        />
                    ))}
                </div>
            )}
            {/* Confirmation Modal */}
            <Modal
                isOpen={modal.show}
                title={modal.title}
                message={modal.message}
                onConfirm={modal.onConfirm}
                onClose={() => setModal({ ...modal, show: false })}
                type="danger"
                confirmText="DELETE PROJECT"
                cancelText="CANCEL"
            />
        </div>
    );
};

export default ProjectManager;
