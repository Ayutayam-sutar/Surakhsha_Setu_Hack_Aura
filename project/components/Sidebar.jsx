import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from '../contexts/SidebarContext'; // Import the new hook
import { Role } from '../types';

import {
  HomeIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  ChevronDoubleLeftIcon,
} from '@heroicons/react/24/outline';


const NavItem = ({ to, icon, label, isCollapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group relative flex items-center px-4 py-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
        isActive
          ? 'bg-brand-blue-dark text-white'
          : 'text-gray-300 hover:bg-brand-blue-dark hover:text-white'
      }`
    }
  >
    {icon}
    <span
      className={`overflow-hidden transition-all ${
        isCollapsed ? 'w-0' : 'w-full ml-3'
      }`}
    >
      {label}
    </span>
    {isCollapsed && (
      <div
        className="absolute left-full rounded-md px-2 py-1 ml-6 bg-brand-blue-dark text-white text-sm 
                   invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
      >
        {label}
      </div>
    )}
  </NavLink>
);


export const Sidebar = () => {
  const { user, logout } = useAuth();
  // Get state and setter from the context instead of from props
  const { isSidebarOpen, setSidebarOpen } = useSidebar();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const commonLinks = [
    { to: '/dashboard', icon: <HomeIcon className="h-6 w-6" />, label: 'Dashboard' },
    { to: '/profile', icon: <UserCircleIcon className="h-6 w-6" />, label: 'Profile' },
    { to: '/safety-check', icon: <ShieldCheckIcon className="h-6 w-6" />, label: 'Safety Check' },
  ];

  const volunteerLinks = [
    { to: '/training', icon: <AcademicCapIcon className="h-6 w-6" />, label: 'Training Hub' },
  ];

  const links = user?.role === Role.VOLUNTEER ? [...commonLinks, ...volunteerLinks] : commonLinks;

  return (
    <>
      <aside
        className={`bg-neutral-dark text-white fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out md:sticky md:translate-x-0
                   ${isCollapsed ? 'w-20' : 'w-64'} 
                   ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} // Controlled by state from the context
      >
        <div className={`flex items-center justify-between p-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <h2 className={`font-bold text-2xl transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            Suraksha Setu
          </h2>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-md hover:bg-brand-blue-dark hidden md:block">
            <ChevronDoubleLeftIcon className={`h-6 w-6 transition-transform duration-300 ${isCollapsed && 'rotate-180'}`} />
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-2">
          {links.map((link) => (
            <NavItem key={link.to} {...link} isCollapsed={isCollapsed} />
          ))}
        </nav>

        <div className="border-t border-gray-700 p-2">
            <div className="group relative flex items-center px-4 py-3 my-1 font-medium rounded-md cursor-pointer hover:bg-brand-blue-dark hover:text-white text-gray-300" onClick={logout}>
                <ArrowRightOnRectangleIcon className="h-6 w-6"/>
                <span className={`overflow-hidden transition-all ${isCollapsed ? 'w-0' : 'w-full ml-3'}`}>
                    Logout
                </span>
                {isCollapsed && (
                    <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-brand-blue-dark text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
                        Logout
                    </div>
                )}
            </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} // Use the setter from the context to close
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
        ></div>
      )}
    </>
  );
};