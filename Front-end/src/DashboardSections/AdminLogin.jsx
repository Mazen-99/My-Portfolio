import React, { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLogin = ({ password, setPassword, handleLogin, loading, error }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="fixed inset-0 bg-[#292929] flex items-center justify-center z-1000 p-4 font-sans">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="bg-[#111] border border-white/5 w-full max-w-[400px] rounded-3xl p-8 relative shadow-3xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                        <FaLock size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h2>
                    <p className="text-gray-400 text-sm">Please enter the administrator password </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full bg-[#1a1a1a] border border-white/10 p-3 pr-12 rounded-2xl focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all duration-300 text-white placeholder:text-gray-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 py-3 rounded-xl">
                            <p className="text-red-400 text-xs text-center font-medium px-4">{error}</p>
                        </div>
                    )}
                    <div className="flex justify-center">
                        <button
                            disabled={loading}
                            className="bg-primary hover:bg-orange-600 text-white font-bold p-4 rounded-2xl shadow-lg shadow-primary/20 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base mt-2"
                        >
                            {loading ? 'Verifying Access...' : 'Sign In to Dashboard'}
                        </button>
                    </div>

                    <p className="text-[10px] text-gray-600 text-center uppercase tracking-widest mt-6">Authorized Personnel Only</p>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
