import React from 'react';
import { FaExclamationTriangle, FaTools, FaRedo } from 'react-icons/fa';

const ServerError = () => {
    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 bg-[#050505] z-[999999] flex flex-col items-center justify-center p-6">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[150px]"></div>

            <div className="relative z-10 max-w-xl w-full text-center space-y-12">
                {/* Warning Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-32 h-32 bg-red-500/10 border border-red-500/20 rounded-[3rem] flex items-center justify-center animate-pulse">
                            <FaExclamationTriangle className="text-red-500 text-5xl" />
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-black border border-white/5 rounded-2xl flex items-center justify-center shadow-2xl">
                            <FaTools className="text-gray-500 text-xl" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
                        System <span className="text-red-500">Offline</span>
                    </h1>
                    <div className="h-1.5 w-24 bg-red-500 mx-auto rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)]"></div>
                    <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-md mx-auto">
                        We're currently fine-tuning our server core. The digital ecosystem will be back online in a few minutes.
                    </p>
                </div>

                {/* Counter-Action */}
                <div className="flex flex-col items-center gap-6">
                    <button
                        onClick={handleRetry}
                        className="group relative bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-5 rounded-[2rem] font-bold transition-all duration-500 flex items-center gap-3 cursor-pointer"
                    >
                        <FaRedo className="group-hover:rotate-180 transition-transform duration-700 text-red-500" />
                        ATTEMPT RECONNECTION
                    </button>

                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.5em]">
                        Error Code: 503_SERVER_TIMEOUT
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ServerError;
