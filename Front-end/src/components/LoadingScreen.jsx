import React from 'react';
import { FaRocket, FaTerminal } from 'react-icons/fa';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-[#050505] z-[999999] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo or Icon */}
                <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mb-10 animate-bounce transition-transform duration-1000">
                    <FaRocket className="text-primary text-4xl" />
                </div>

                {/* Loading Text */}
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-black text-white tracking-[0.3em] uppercase italic flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-primary"></span>
                        Initializing
                        <span className="w-8 h-[2px] bg-primary"></span>
                    </h2>

                    <div className="flex flex-col items-center gap-2">
                        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                            <FaTerminal className="text-primary/50" />
                            Aligning Digital Ecosystem
                        </p>

                        {/* Progress Bar Container */}
                        <div className="w-64 h-[3px] bg-white/5 rounded-full mt-4 overflow-hidden relative">
                            {/* Animated Inner Bar */}
                            <div className="absolute inset-0 bg-primary animate-[loading_2s_ease-in-out_infinite] rounded-full shadow-[0_0_15px_rgba(255,107,0,0.5)]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-12 text-[10px] text-gray-700 font-bold uppercase tracking-[0.5em]">
                System Version 2.0.4
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0%); }
                    100% { transform: translateX(100%); }
                }
            `}} />
        </div>
    );
};

export default LoadingScreen;
