import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Modal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'danger', // danger, success, info
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isConfirm = true
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const icons = {
        danger: <FaExclamationTriangle className="text-red-500 text-4xl" />,
        success: <FaCheckCircle className="text-green-500 text-4xl" />,
        info: <FaInfoCircle className="text-blue-500 text-4xl" />
    };

    const buttonStyles = {
        danger: 'bg-red-500 hover:bg-red-600 shadow-red-500/20',
        success: 'bg-green-500 hover:bg-green-600 shadow-green-500/20',
        info: 'bg-primary hover:bg-orange-600 shadow-primary/20'
    };

    // Modal Content
    const modalContent = (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Extremely dark overlay with strong blur to hide background */}
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500"
                onClick={onClose}
            ></div>

            {/* Modal Card - Centered and elevated */}
            <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-[3rem] p-10 shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-gray-500 hover:text-white transition cursor-pointer"
                >
                    <FaTimes size={24} />
                </button>

                <div className="text-center space-y-6">
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center bg-white/5 border border-white/5 shadow-inner">
                            {icons[type]}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{title}</h3>
                        <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                        <p className="text-description text-base leading-relaxed font-medium px-4">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 mt-12">
                    {!isConfirm ? (
                        <button
                            onClick={onClose}
                            className={`flex-1 py-5 rounded-[1.5rem] text-white font-black text-sm uppercase tracking-widest transition shadow-lg cursor-pointer ${buttonStyles[type]}`}
                        >
                            Got it
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onClose}
                                className="flex-1 py-5 rounded-[1.5rem] bg-white/5 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition border border-white/5 cursor-pointer"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={() => {
                                    if (onConfirm) onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 py-5 rounded-[1.5rem] text-white font-black text-sm uppercase tracking-widest transition shadow-lg cursor-pointer ${buttonStyles[type]}`}
                            >
                                {confirmText}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    // Use portal to ensure it's at the top level
    return createPortal(modalContent, document.body);
};

export default Modal;
