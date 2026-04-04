import React, { useState, useEffect } from 'react';
import { checkAdminAuth as checkAdmin } from './api/adminApi';
import { getAbout } from './api/aboutApi';
import { getProjects } from './api/projectApi';
import { getTheme } from './api/themeApi';
import { getServices } from './api/serviceApi';
import { FaUser, FaProjectDiagram, FaPalette, FaRocket, FaBars, FaUsers } from 'react-icons/fa';

// Dashboard Sections
import AdminLogin from './DashboardSections/AdminLogin';
import Sidebar from './DashboardSections/Sidebar';
import AboutManager from './DashboardSections/AboutManager';
import ProjectManager from './DashboardSections/ProjectManager';
import ThemeManager from './DashboardSections/ThemeManager';
import ServiceManager from './DashboardSections/ServiceManager';
import VisitorsManager from './DashboardSections/VisitorsManager';

const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(localStorage.getItem('admin_active_tab') || 'about');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Tab Data
    const [aboutData, setAboutData] = useState(null);
    const [projects, setProjects] = useState([]);
    const [themeData, setThemeData] = useState(null);
    const [services, setServices] = useState([]);

    // Define tabs for Sidebar
    const tabs = [
        { id: 'about', label: 'About', icon: <FaUser /> },
        { id: 'projects', label: 'Projects', icon: <FaProjectDiagram /> },
        { id: 'services', label: 'Services', icon: <FaRocket /> },
        { id: 'theme', label: 'Theme Settings', icon: <FaPalette /> },
        { id: 'visitors', label: 'Visitors', icon: <FaUsers /> }
    ];

    // Persist active tab
    useEffect(() => {
        localStorage.setItem('admin_active_tab', activeTab);
    }, [activeTab]);

    // Auth logic
    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const ok = await checkAdmin(password);
            if (ok) {
                setIsAuthenticated(true);
                localStorage.setItem('admin_pwd', password);
                fetchInitialData();
            } else {
                setError('Invalid password');
            }
        } catch (err) {
            setError(err.message || 'Invalid password');
        } finally {
            setLoading(false);
        }
    };

    const fetchInitialData = async () => {
        try {
            // Fetch everything in parallel for maximum speed
            const [about, projs, theme, svcs] = await Promise.all([
                getAbout(),
                getProjects(),
                getTheme(),
                getServices()
            ]);

            setAboutData(about);
            setProjects(projs);
            setThemeData(theme);
            setServices(svcs);
        } catch (err) {
            console.error('Failed to synchronize dashboard data:', err);
        }
    };

    useEffect(() => {
        const savedPwd = localStorage.getItem('admin_pwd');
        if (savedPwd) {
            setPassword(savedPwd);
            // Verify and auto-login
            checkAdmin(savedPwd)
                .then((ok) => {
                    if (ok) {
                        setIsAuthenticated(true);
                        fetchInitialData();
                    }
                })
                .catch(() => localStorage.removeItem('admin_pwd'));
        }
    }, []);

    if (!isAuthenticated) {
        return (
            <AdminLogin
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                loading={loading}
                error={error}
            />
        );
    }

    return (
        <div className="min-h-screen bg-section-primary text-headline flex flex-col lg:flex-row font-sans selection:bg-primary/30 relative transition-colors duration-500">
            {/* Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                tabs={tabs} // Pass dynamic tabs
                onLogout={() => {
                    localStorage.removeItem('admin_pwd');
                    setIsAuthenticated(false);
                }}
            />

            {/* Main Content */}
            <main className="flex-1 min-h-screen overflow-y-auto flex flex-col transition-colors duration-500">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between p-6 bg-section-secondary/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20 text-white">M</div>
                        <h1 className="text-lg font-bold tracking-tight text-headline">Admin <span className="text-primary text-sm">Dash</span></h1>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-3 bg-white/5 rounded-xl text-primary hover:bg-white/10 transition cursor-pointer"
                    >
                        <FaBars size={20} />
                    </button>
                </header>

                <div className="p-6 md:p-12 flex-1 relative overflow-hidden">
                    {/* Background Light Effects */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4 pointer-events-none" />
                    
                    <header className="mb-12 flex justify-between items-end relative z-10">
                        <div>
                            <div className="hidden md:flex items-center gap-2 text-primary text-sm font-black uppercase tracking-[0.3em] mb-3 px-1">
                                <span className="w-10 h-[3px] bg-primary rounded-full"></span> SYSTEM MANAGEMENT
                            </div>
                            <h2 className="text-4xl md:text-7xl font-black capitalize tracking-tighter text-headline italic">
                                {activeTab} <span className="text-primary not-italic">.</span>
                            </h2>
                        </div>
                    </header>

                    <section className="bg-section-secondary/30 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 p-6 md:p-12 shadow-2xl relative z-10 transition-colors duration-500">
                        {activeTab === 'about' && (
                            <AboutManager data={aboutData} onSave={fetchInitialData} password={password} />
                        )}
                        {activeTab === 'projects' && (
                            <ProjectManager projects={projects} onSave={fetchInitialData} password={password} />
                        )}
                        {activeTab === 'theme' && (
                            <ThemeManager data={themeData} onSave={fetchInitialData} password={password} />
                        )}
                        {activeTab === 'services' && (
                            <ServiceManager services={services} onSave={fetchInitialData} password={password} />
                        )}
                        {activeTab === 'visitors' && (
                            <VisitorsManager adminPassword={password} />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
