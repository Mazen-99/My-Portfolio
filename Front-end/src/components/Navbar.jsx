import React, { useEffect, useState } from "react";
import NavbarItems from "./NavbarItems";
import { FaWhatsapp, FaBars, FaTimes, FaCode, FaSun, FaMoon } from "react-icons/fa";
import { getAbout } from "../api/aboutApi";
import { useTheme } from "../contexts/ThemeContext";

const sections = [
  "hero",
  "services",
  "about",
  "skills",
  "projects",
  "contact",
];

const Navbar = () => {

  const { theme, mode, toggleTheme, loading } = useTheme();
  if (loading || !theme) return null;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const data = await getAbout();
        setPhoneNumber(data.phone);
      } catch (error) {
        console.error("Error fetching phone number:", error);
      }
    };

    fetchPhoneNumber();
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-150px 0px -50% 0px", // Trigger when section is near top
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const openWhatsApp = () => {
    const message = "Hi, I am interested in your services!";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-section-primary shadow-2xl shadow-primary/50 z-50">
      <div className="container mx-auto px-5">
        <div className="flex justify-between items-center py-3">

          {/* Logo */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-linear-to-br from-primary/20 to-primary/5 border-2 border-primary/20 rounded-2xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-all duration-500 shadow-lg shadow-primary/10 overflow-hidden backdrop-blur-sm">
                {/* Visual Accent */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="text-primary text-3xl font-black italic -rotate-12 group-hover:rotate-0 transition-all duration-500 select-none">
                  M
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-section-primary shadow-sm shadow-primary/50 animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter leading-none italic text-headline group-hover:text-primary transition-colors">
                MAZEN<span className="text-primary">.</span>
              </span>
              <span className="text-[10px] font-bold text-description tracking-[0.3em] uppercase leading-none mt-1">
                Portfolio
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavbarItems
              isMobile={false}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>

          {/* Contact Button + Theme Toggle + Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-all duration-300 hover:bg-primary/20 cursor-pointer shadow-lg shadow-primary/50"
              title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {mode === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            <button
              onClick={openWhatsApp}
              className="hidden md:flex bg-primary hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg items-center gap-2 transition duration-300 shadow-lg shadow-primary/20 cursor-pointer"
            >
              <FaWhatsapp size={18} />
              <span className="hidden lg:inline">Contact</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-headline text-3xl"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-section-secondary border-t border-slate-700 py-4">
            <div className="flex flex-col gap-4 px-4">
              <NavbarItems
                isMobile={true}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                onItemClick={() => setIsMenuOpen(false)}
              />

              <a
                onClick={openWhatsApp}
                className="w-full bg-primary hover:opacity-90 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition duration-300"
              >
                <FaWhatsapp size={20} />
                Contact on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
