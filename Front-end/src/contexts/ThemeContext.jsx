import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getTheme } from '../api/themeApi';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(null);
    const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'dark');
    const [loading, setLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const modeRef = useRef(mode);

    // Keep modeRef updated for interval access
    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    const applyTheme = (data, currentMode) => {
        if (!data) return;
        const root = document.documentElement;

        if (currentMode === 'dark') {
            // Apply Dark-specific values
            if (data.darkPrimary) root.style.setProperty('--primary-color', data.darkPrimary);
            if (data.darkDescription) root.style.setProperty('--description-color', data.darkDescription);
            if (data.darkHeadline) root.style.setProperty('--headline-color', data.darkHeadline);
            if (data.darkPrimarySection) root.style.setProperty('--primary-section-color', data.darkPrimarySection);
            if (data.darkSecondarySection) root.style.setProperty('--secondary-section-color', data.darkSecondarySection);
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            // Apply Light-specific values
            if (data.lightPrimary) root.style.setProperty('--primary-color', data.lightPrimary);
            if (data.lightDescription) root.style.setProperty('--description-color', data.lightDescription);
            if (data.lightHeadline) root.style.setProperty('--headline-color', data.lightHeadline);
            if (data.lightPrimarySection) root.style.setProperty('--primary-section-color', data.lightPrimarySection);
            if (data.lightSecondarySection) root.style.setProperty('--secondary-section-color', data.lightSecondarySection);
            root.classList.add('light');
            root.classList.remove('dark');
        }
    };

    const fetchTheme = async () => {
        try {
            const data = await getTheme();
            setTheme(data);
            applyTheme(data, modeRef.current);
        } catch (error) {
            console.error('Error getting theme:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTheme();
        const interval = setInterval(fetchTheme, 3000);
        return () => clearInterval(interval);
    }, []);

    const toggleTheme = (e) => {
        if (e) e.preventDefault();
        
        setIsTransitioning(true);
        const newMode = mode === 'dark' ? 'light' : 'dark';
        
        setTimeout(() => {
            setMode(newMode);
            localStorage.setItem('themeMode', newMode);
            applyTheme(theme, newMode);
        }, 50);

        setTimeout(() => setIsTransitioning(false), 800);
    };

    return (
        <ThemeContext.Provider value={{ theme, mode, toggleTheme, loading }}>
            {children}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ clipPath: 'circle(0% at 0% 0%)' }}
                        animate={{ clipPath: 'circle(150% at 0% 0%)' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-1000000 pointer-events-none"
                        style={{
                            backgroundColor: mode === 'dark' 
                                ? (theme?.lightPrimarySection || '#f8fafc') 
                                : (theme?.darkPrimarySection || '#0f172a')
                        }}
                    />
                )}
            </AnimatePresence>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
