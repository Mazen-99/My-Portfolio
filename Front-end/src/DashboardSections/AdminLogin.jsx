import React, { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLogin = ({ password, setPassword, handleLogin, loading, error }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="fixed inset-0 bg-section-primary flex items-center justify-center z-10000 p-4 font-sans transition-colors duration-500">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="bg-section-secondary/40 backdrop-blur-xl border border-white/5 w-full max-w-[400px] rounded-[2.5rem] p-10 relative shadow-2xl transition-colors duration-500">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-lg shadow-primary/5">
                        <FaLock size={30} />
                    </div>
                    <h2 className="text-3xl font-black text-headline mb-2 tracking-tighter uppercase italic">
                        Admin <span className="text-primary not-italic">Dash</span>
                    </h2>
                    <p className="text-description text-xs font-bold tracking-tight opacity-60 italic">Architect access required to proceed. </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-description uppercase tracking-[0.2em] ml-1">Secure Keyphrase</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                className="w-full bg-section-primary/20 border border-white/5 p-4 pr-12 rounded-2xl focus:border-primary/40 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-500 text-headline font-bold placeholder:text-description/30 shadow-inner"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-description/40 hover:text-primary transition-colors cursor-pointer"
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 py-3 rounded-2xl animate-bounce">
                            <p className="text-red-500 text-[10px] text-center font-black uppercase tracking-widest px-4">{error}</p>
                        </div>
                    )}
                    
                    <button
                        disabled={loading}
                        className="w-full bg-primary hover:bg-orange-600 text-white font-black p-5 rounded-2xl shadow-xl shadow-primary/20 transition-all duration-500 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs uppercase tracking-widest group overflow-hidden"
                    >
                        <span className="relative z-10">{loading ? 'Verifying Authorization...' : 'Authenticate Access'}</span>
                    </button>

                    <p className="text-[9px] text-description font-black text-center uppercase tracking-[0.3em] mt-8 opacity-20">Authorized Personnel Only</p>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
