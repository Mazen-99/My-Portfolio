import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './Sections/HeroSection'
import ServiceSection from './Sections/ServiceSection'
import AboutSection from './Sections/AboutSection'
import SkillsSection from './Sections/SkillsSection'
import ProjectsSection from './Sections/ProjectsSection'
import ContactSection from './Sections/ContactSection'
import Footer from './components/Footer'
import { ThemeProvider } from './contexts/ThemeContext'
import { getAbout } from './api/aboutApi'
import { getServices } from './api/serviceApi'
import { getProjects } from './api/projectApi'
import { getTheme } from './api/themeApi'
import LoadingScreen from './components/LoadingScreen'
import ServerError from './components/ServerError'

import { Routes, Route } from 'react-router'
import Dashboard from './Dashboard'
import { trackVisit } from './api/adminApi'

const App = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [serverStatus, setServerStatus] = useState('online'); // online, offline

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Parallel fetch for all core data
        const [aboutResult] = await Promise.allSettled([
          getAbout(),
          getServices(),
          getProjects(),
          getTheme(),
          trackVisit()
        ]);
        
        // If the core 'about' data failed, we consider the server offline
        if (aboutResult.status === 'rejected') {
          console.error('Core data fetch failed:', aboutResult.reason);
          setServerStatus('offline');
        } else {
          setServerStatus('online');
        }

        // Short delay to ensure browser finishes rendering off-screen
        setTimeout(() => {
          setIsInitializing(false);
        }, 800);
      } catch (error) {
        console.error('Unexpected initialization error:', error);
        setServerStatus('offline');
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (serverStatus === 'offline') {
    return <ServerError />;
  }

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={
          <div className='bg-section-primary text-headline pt-20 overflow-x-hidden transition-colors duration-500'>
            <Navbar />
            <HeroSection />
            <ServiceSection />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <ContactSection />
            <Footer />
          </div>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
