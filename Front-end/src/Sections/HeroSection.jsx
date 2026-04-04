import React, { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import Toast from '../components/Toast';
import { FaWhatsapp, FaLinkedin, FaFacebook, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getAbout } from '../api/aboutApi';

const HeroSection = () => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [titles, setTitles] = useState([]);
    const [socials, setSocials] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const ensureAbsoluteUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
            return url;
        }
        return `https://${url}`;
    };

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const data = await getAbout();
                setName(data.name);
                setBio(data.bio);
                setTitles(data.titles || []);
                setSocials(data.socials);
            } catch (error){
                console.error('Failed to load about data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAbout();
    }, []);

    if (loading) return null;

    const handleViewCV = async () => {
        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const cvUrl = `${apiBase}/cv`;

            setToast({ show: true, message: 'Processing your request...', type: 'success' });
            
            const response = await fetch(cvUrl, { method: 'HEAD' });
            
            if (response.ok) {
                setToast({ show: true, message: 'Downloading CV...', type: 'success' });
                window.location.href = cvUrl;
            } else {
                setToast({ show: true, message: 'CV file not found on server.', type: 'error' });
            }
        } catch (error) {
            setToast({ show: true, message: 'Could not connect to server.', type: 'error' });
        }
    };

    return (
        <section id="hero" className="min-h-screen bg-section-primary text-headline flex items-center justify-center pb-15">
            <div className="container mx-auto px-4 md:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center">

                    {/* Left Content */}
                    <div className="md:block flex flex-col items-center justify-center w-full">
                        <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-description text-md mb-2">
                            Hello There
                        </motion.p>

                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl lg:text-6xl font-bold mb-3 text-center md:text-left md:whitespace-nowrap">
                            I'm <span className="text-primary">{name}</span>
                        </motion.h1>

                        {titles.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-2xl lg:text-3xl font-semibold text-primary mb-5 md:mb-10">
                                <TypeAnimation sequence={titles.flatMap(title => [title, 2000])} speed={50} repeat={Infinity} />
                            </motion.div>
                        )}

                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-description text-lg leading-snug mb-8 max-w-lg">
                            {bio}
                        </motion.p>

                        {/* Social Icons */}
                        {socials && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex gap-6 mb-8">
                                {socials.whatsapp && <a href={`https://wa.me/${socials.whatsapp}`} target="_blank" rel="noreferrer" className="text-primary hover:scale-125 transition-transform duration-300"><FaWhatsapp size={28} /></a>}
                                {socials.linkedin && <a href={ensureAbsoluteUrl(socials.linkedin)} target="_blank" rel="noreferrer" className="text-primary hover:scale-125 transition-transform duration-300"><FaLinkedin size={28} /></a>}
                                {socials.facebook && <a href={ensureAbsoluteUrl(socials.facebook)} target="_blank" rel="noreferrer" className="text-primary hover:scale-125 transition-transform duration-300"><FaFacebook size={28} /></a>}
                                {socials.github && <a href={ensureAbsoluteUrl(socials.github)} target="_blank" rel="noreferrer" className="text-primary hover:scale-125 transition-transform duration-300"><FaGithub size={28} /></a>}
                            </motion.div>
                        )}

                        <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }} onClick={handleViewCV} className="bg-primary hover:bg-section-primary hover:text-primary border border-primary text-white font-black px-12 py-4 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer active:scale-95 uppercase tracking-widest text-sm">
                            Download CV
                        </motion.button>
                    </div>

                    {/* Right Image */}
                    <div className="flex justify-center lg:justify-end mt-10 lg:mt-0">
                        <i className="devicon-react-original text-primary text-[300px] md:text-[380px] spin-continuous"></i>
                    </div>

                </div>
            </div>

            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
        </section>
    );
};

export default HeroSection;
