import React, { useEffect, useState } from "react";
import NavbarItems from "./NavbarItems";
import { FaWhatsapp, FaBars, FaTimes, FaCode } from "react-icons/fa";
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

  const { theme, loading } = useTheme();
  if (loading || !theme) return <p>Loading...</p>;

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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        threshold: 0.4,
      }
    );

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
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-3">

          {/* Logo */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-all duration-500 shadow-lg shadow-primary/20">
                <FaCode className="text-primary text-2xl -rotate-12 group-hover:rotate-0 transition-all duration-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-section-primary animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter leading-none italic">
                MAZEN<span className="text-primary">.</span>
              </span>
              <span className="text-[10px] font-bold text-gray-500 tracking-[0.3em] uppercase leading-none mt-1">
                Developer
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavbarItems
              isMobile={false}
              activeSection={activeSection}
            />
          </div>

          {/* Contact Button + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={openWhatsApp}
              className="hidden md:flex bg-primary hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg items-center gap-2 transition duration-300 shadow-lg shadow-primary/20 cursor-pointer"
            >
              <FaWhatsapp size={18} />
              <span className="hidden lg:inline">Contact</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white text-3xl"
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
