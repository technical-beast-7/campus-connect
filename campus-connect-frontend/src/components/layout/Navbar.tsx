import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import type { User } from '../../types';

interface NavbarProps {
  user?: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-soft border-b border-gray-200 backdrop-blur-sm bg-opacity-95 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-all duration-200 transform hover:scale-105">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:rotate-3">
                <span className="text-white font-bold text-lg">CC</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">Campus Connect</span>
                <div className="text-xs text-gray-500 -mt-1">Issue Management</div>
              </div>
              <div className="sm:hidden">
                <span className="text-lg font-bold text-gray-900">Campus Connect</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-primary-200"
                  />
                ) : (
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="w-6 h-6 text-primary-600" />
                  </div>
                )}
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-600 capitalize">{user.role}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          {user && (
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 keyboard-nav transition-all duration-200 hover:scale-110 active:scale-95"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
              >
                <span className="sr-only">{isMobileMenuOpen ? "Close main menu" : "Open main menu"}</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {user && isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-4 pt-4 pb-6 space-y-4 bg-white border-t border-gray-200 shadow-lg" role="menu" aria-orientation="vertical" aria-labelledby="mobile-menu-button">
            {/* User Profile Section */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary-200"
                />
              ) : (
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-8 h-8 text-primary-600" />
                </div>
              )}
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-600 capitalize">{user.role}</div>
                <div className="text-xs text-gray-500">{user.department}</div>
              </div>
            </div>
            
            {/* Logout Button */}
            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 keyboard-nav"
                role="menuitem"
                aria-label="Logout from your account"
              >
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;