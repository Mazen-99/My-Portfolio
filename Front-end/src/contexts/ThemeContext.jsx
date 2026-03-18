import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTheme } from '../api/themeApi';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const data = await getTheme();
        setTheme(data);
        if (data) {
          if (data.primary) document.documentElement.style.setProperty('--primary-color', data.primary);
          if (data.headline) document.documentElement.style.setProperty('--headline-color', data.headline);
          if (data.description) document.documentElement.style.setProperty('--description-color', data.description);
          if (data.primarySection) document.documentElement.style.setProperty('--primary-section-color', data.primarySection);
          if (data.secondarySection) document.documentElement.style.setProperty('--secondary-section-color', data.secondarySection);
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTheme(); // جلب البيانات أول مرة

    // إعداد التحديث اللحظي كل 3 ثوانٍ
    const interval = setInterval(fetchTheme, 3000);

    return () => clearInterval(interval); // تنظيف الـ Interval عند إغلاق المكون
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
