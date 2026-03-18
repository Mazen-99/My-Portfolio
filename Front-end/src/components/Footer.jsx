import React, { useEffect, useState } from 'react';
import { FaHeart, FaArrowUp } from 'react-icons/fa';
import { getAbout } from '../api/aboutApi';

const Footer = () => {
    const [name, setName] = useState('My Portfolio');
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const fetchName = async () => {
            try {
                const data = await getAbout();
                if (data && data.name) {
                    setName(data.name);
                }
            } catch (err) {
                console.error('Footer failed to fetch name:', err);
            }
        };
        fetchName();
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="w-full bg-section-primary border-t border-white/5 py-2">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    {/* Left: Copyright */}
                    <div className="flex-1 order-2 md:order-1">
                        <p className="text-gray-500 text-sm tracking-wide">
                            © {currentYear} <span className="text-white">{name}</span>. All Rights Reserved.
                        </p>
                    </div>

                    {/* Center: Made with Love */}
                    <div className="flex-1 order-1 md:order-2 flex justify-center">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5 group transition-colors hover:border-primary/20">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Built with</span>
                            <FaHeart className="text-red-500 animate-pulse text-xs" />
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">by Master</span>
                        </div>
                    </div>

                    {/* Right: Back to Top */}
                    <div className="flex-1 order-3 flex justify-center md:justify-end">
                        <button
                            onClick={scrollToTop}
                            className="group flex items-center gap-3 text-gray-500 hover:text-primary transition-all duration-300 font-black text-[10px] uppercase tracking-[0.3em] cursor-pointer"
                        >
                            <span className="hidden md:inline">Back to Orbit</span>
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors border border-white/5">
                                <FaArrowUp size={12} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
