import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as RiIcons from 'react-icons/ri';
import * as BiIcons from 'react-icons/bi';
import * as HiIcons from 'react-icons/hi';
import * as MdIcons from 'react-icons/md';

const DynamicIcon = ({ name, size = 24, className = "" }) => {
    // 1. Support for Devicon (CSS-based icons)
    if (name?.startsWith('devicon-')) {
        return <i 
            className={`${name} ${className}`} 
            style={{ fontSize: size }} 
        />;
    }

    // 2. Support for React-Icons (Component-based icons)
    const allIcons = { ...FaIcons, ...SiIcons, ...RiIcons, ...BiIcons, ...HiIcons, ...MdIcons };
    const IconComponent = allIcons[name];

    if (!IconComponent) {
        return <FaIcons.FaExclamationTriangle size={size} className={className} />;
    }

    return <IconComponent size={size} className={className} />;
};

export default DynamicIcon;
