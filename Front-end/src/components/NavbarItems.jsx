import React from "react";
import { Link } from "react-scroll";

const navLinks = [
    { label: "Home", to: "hero" },
    { label: "Services", to: "services" },
    { label: "About", to: "about" },
    { label: "Skills", to: "skills" },
    { label: "Projects", to: "projects" },
    { label: "Contact", to: "contact" },
];

const NavbarItems = ({ isMobile, onItemClick, activeSection }) => {
    const containerClass = isMobile
        ? "flex flex-col gap-4 w-max"
        : "flex gap-8 items-center";

    return (
        <div className={containerClass}>
            {navLinks.map((link) => (
                <Link
                    key={link.to}
                    to={link.to}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    onClick={() => onItemClick && onItemClick()}
                    className={`cursor-pointer text-lg font-medium transition duration-300 ${activeSection === link.to ? "text-primary border-b-2 border-primary" : "text-headline/60 hover:text-primary"
                        }`}
                >
                    {link.label}
                </Link>
            ))}
        </div>
    );
};

export default NavbarItems;
