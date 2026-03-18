import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as RiIcons from 'react-icons/ri';
import * as BiIcons from 'react-icons/bi';
import * as HiIcons from 'react-icons/hi';
import * as MdIcons from 'react-icons/md';

const DynamicIcon = ({ name, size = 24, className = "" }) => {
    // Combine all icon sets
    const allIcons = { ...FaIcons, ...SiIcons, ...RiIcons, ...BiIcons, ...HiIcons, ...MdIcons };

    // Look up the icon
    const IconComponent = allIcons[name];

    // If icon not found, fallback to a default or nothing
    if (!IconComponent) {
        return <FaIcons.FaQuestionCircle size={size} className={className} />;
    }

    return <IconComponent size={size} className={className} />;
};

export default DynamicIcon;
