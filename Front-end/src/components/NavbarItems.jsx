import React from "react";

const navLinks = [
    { label: "Home", to: "hero" },
    { label: "Services", to: "services" },
    { label: "About", to: "about" },
    { label: "Skills", to: "skills" },
    { label: "Projects", to: "projects" },
    { label: "Contact", to: "contact" },
];

const NavbarItems = ({ isMobile, onItemClick, activeSection, setActiveSection }) => {
    const containerClass = isMobile
        ? "flex flex-col gap-4 w-max"
        : "flex gap-8 items-center";

    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            // Manually set active for immediate feedback
            if (setActiveSection) setActiveSection(id);
            
            element.scrollIntoView({ behavior: 'smooth' });
            if (onItemClick) onItemClick();
        }
    };

    return (
        <div className={containerClass}>
            {navLinks.map((link) => (
                <button
                    key={link.to}
                    onClick={() => handleScroll(link.to)}
                    className={`cursor-pointer text-lg font-medium transition-all duration-300 relative group py-1 ${
                        activeSection === link.to 
                            ? "text-primary" 
                            : "text-headline/60 hover:text-primary"
                    }`}
                >
                    {link.label}
                    
                    {/* Visual Indicator (Border Bottom) */}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                        activeSection === link.to ? "w-full" : "w-0 group-hover:w-full"
                    }`} />
                </button>
            ))}
        </div>
    );
};

export default NavbarItems;
