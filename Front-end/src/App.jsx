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
import LoadingScreen from './components/LoadingScreen'
import ServerError from './components/ServerError'

import { Routes, Route } from 'react-router'
import Dashboard from './Dashboard'

const App = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [serverStatus, setServerStatus] = useState('online'); // online, offline

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Try to fetch About data as a health check for the server
        await getAbout();
        // Artificial delay for smooth transition (optional, remove if you want it instant)
        setTimeout(() => {
          setIsInitializing(false);
          setServerStatus('online');
        }, 2000);
      } catch (error) {
        console.error('Initialization failed:', error);
        setIsInitializing(false);
        setServerStatus('offline');
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
          <div className='bg-section-primary text-white pt-20 overflow-x-hidden'>
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
