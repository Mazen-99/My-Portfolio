import React, { useState } from 'react';
import { FaUser, FaProjectDiagram, FaPalette, FaSignOutAlt, FaTimes, FaRocket } from 'react-icons/fa';
import Modal from './Modal';

const Sidebar = ({ activeTab, setActiveTab, onLogout, isOpen, setIsOpen }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const navItems = [
        { id: 'about', label: 'About Me', icon: <FaUser /> },
        { id: 'projects', label: 'Projects', icon: <FaProjectDiagram /> },
        { id: 'services', label: 'Services', icon: <FaRocket /> },
        { id: 'theme', label: 'Theme Settings', icon: <FaPalette /> }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[990] lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-[1000] w-72 bg-slate-900/40 backdrop-blur-xl border-r border-white/5 p-8 flex flex-col 
                transform transition-transform duration-500 ease-in-out lg:translate-x-0 lg:h-screen lg:sticky lg:top-0
                ${isOpen ? 'translate-x-0 shadow-2xl shadow-primary/20' : '-translate-x-full'}
            `}>
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20 text-white">M</div>
                        <h1 className="text-xl font-bold tracking-tight text-white">Admin <span className="text-primary">Dash</span></h1>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white transition cursor-pointer"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <nav className="space-y-3 flex-1">
                    {navItems.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                if (window.innerWidth < 1024) setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition duration-500 group cursor-pointer ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'hover:bg-white/5 text-description hover:text-white'}`}
                        >
                            <span className={`${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'} transition`}>{tab.icon}</span>
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition duration-300 group cursor-pointer mt-auto"
                >
                    <FaSignOutAlt className="group-hover:-translate-x-1 transition" />
                    <span className="font-medium">Logout System</span>
                </button>
            </aside>

            {/* Logout Confirmation Modal */}
            <Modal
                isOpen={showLogoutModal}
                title="System Logout"
                message="Are you sure you want to terminate your current session? You will need to re-enter your administrator credentials to access the system again."
                onConfirm={onLogout}
                onClose={() => setShowLogoutModal(false)}
                type="info"
                confirmText="YES, LOGOUT"
                cancelText="STAY LOGGED IN"
            />
        </>
    );
};

export default Sidebar;
