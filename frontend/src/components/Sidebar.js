import React from 'react';
import { FaHome, FaBook, FaChartBar, FaAward, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FaBook />, label: 'My Courses', path: '/dashboard/courses' },
    { icon: <FaChartBar />, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: <FaAward />, label: 'Badges', path: '/dashboard/badges' },
    { icon: <FaCog />, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-screen w-64 bg-primary text-white transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-full md:relative`}>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center font-bold">
            L
          </div>
          <span className="font-bold text-xl">Learnatics</span>
        </div>
        <nav className="space-y-4">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
