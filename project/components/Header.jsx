import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useSidebar } from '../contexts/SidebarContext'; // To control the sidebar
import { useClickOutside } from '../hooks/useClickOutside';
import { Button } from './Button';
import { Bars3Icon } from '@heroicons/react/24/outline'; // For the mobile menu icon

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t, languages } = useLanguage();
  const { setSidebarOpen } = useSidebar(); // Get the function to open the sidebar from context
  const location = useLocation(); // To know what page we are on

  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useClickOutside(() => setLangDropdownOpen(false));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Define which paths should show the mobile menu button
  const sidebarPaths = ['/dashboard', '/profile', '/safety-check', '/training', '/admin'];
  // Check if the current page path starts with any of the defined sidebar paths
  const showMenuButton = user && sidebarPaths.some(path => location.pathname.startsWith(path));

  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Left side: Menu Button (mobile) and Branding */}
        <div className="flex items-center">
          {/* Conditionally render the menu button */}
          {showMenuButton && (
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="text-gray-600 mr-4 md:hidden"
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
          <Link className="text-2xl font-bold text-brand-blue">
            Suraksha Setu
          </Link>
        </div>

        {/* Right side: Navigation for language and auth */}
        <nav className="flex items-center space-x-2 sm:space-x-4">
          {/* Language Selector */}
          <div className="relative" ref={langDropdownRef}>
            <button onClick={() => setLangDropdownOpen(!isLangDropdownOpen)} className="flex items-center text-gray-600 hover:text-brand-blue font-semibold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.527-1.917c.313-.11.65-.168 1-.168.343 0 .672.05 1 .149V8a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 019 8V7.5a3 3 0 00-3-3 3 3 0 00-1.668.527c-.22.124-.41.277-.57.451V8z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">{languages[language]}</span>
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 border">
                {Object.entries(languages).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => { setLanguage(code); setLangDropdownOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          {user ? (
            <Button variant="secondary" onClick={handleLogout}>{t('logout')}</Button>
          ) : (
            <>
              <Link to="/signin" className="text-gray-600 hover:text-brand-blue font-semibold transition-colors hidden sm:block">{t('signIn')}</Link>
              <Link to="/signup">
                <Button variant="primary">{t('getStarted')}</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};