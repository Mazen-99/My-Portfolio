import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === 'success';

    return (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[999999] flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-2xl animate-in fade-in slide-in-from-top-12 duration-500 max-w-[90%] w-auto min-w-[320px] ${isSuccess
            ? 'bg-[#0f172a]/95 backdrop-blur-md border-green-500/20 text-green-400'
            : 'bg-[#0f172a]/95 backdrop-blur-md border-red-500/20 text-red-400'
            }`}>
            <div className={`text-2xl drop-shadow-[0_0_8px_rgba(34,197,94,0.4)] ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                {isSuccess ? <FaCheckCircle /> : <FaExclamationCircle />}
            </div>
            <div className="flex-1">
                <p className="font-bold text-sm tracking-widest uppercase mb-0.5">{isSuccess ? 'Success' : 'Attention'}</p>
                <p className="text-[13px] text-gray-300 font-medium leading-tight">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition cursor-pointer text-gray-500 hover:text-white"
            >
                <FaTimes size={14} />
            </button>
            <div className={`absolute bottom-0 left-0 h-[3px] opacity-40 animate-progress rounded-full ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`} style={{ animationDuration: '5000ms' }}></div>
        </div>
    );
};

export default Toast;
