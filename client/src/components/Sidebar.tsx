import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import type { User } from '@/types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles: Array<'user' | 'authority'>;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    roles: ['user', 'authority'],
  },
  {
    name: 'Report Issue',
    href: '/report-issue',
    icon: PlusCircleIcon,
    roles: ['user'],
  },
  {
    name: 'My Issues',
    href: '/my-issues',
    icon: DocumentTextIcon,
    roles: ['user'],
  },
  {
    name: 'All Issues',
    href: '/all-issues',
    icon: ClipboardDocumentListIcon,
    roles: ['authority'],
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
    roles: ['authority'],
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserIcon,
    roles: ['user', 'authority'],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  onLogout, 
  isCollapsed = false, 
  onToggleCollapse 
}) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Normalize role for backward compatibility (student/faculty -> user)
  const normalizedRole = (user.role === 'student' || user.role === 'faculty') ? 'user' : user.role;
  
  // Filter navigation items based on user role
  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(normalizedRole as 'user' | 'authority')
  );

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 ${
        isCollapsed ? 'lg:w-16' : 'lg:w-64'
      } transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto shadow-soft">
          {/* Collapse Toggle Button */}
          {onToggleCollapse && (
            <div className="flex justify-end px-4 mb-4">
              <button
                onClick={onToggleCollapse}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                {isCollapsed ? (
                  <ChevronRightIcon className="w-5 h-5" />
                ) : (
                  <ChevronLeftIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          )}

          {/* User Info */}
          {!isCollapsed && (
            <div className="px-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110">
                  <span className="text-primary-600 font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {normalizedRole} • {user.role === 'authority' && user.categories && user.categories.length > 0 
                      ? user.categories.join(', ') 
                      : user.department}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-2 space-y-1" role="navigation" aria-label="Main navigation">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 keyboard-nav hover:transform hover:translate-x-1 ${
                    active
                      ? 'bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 border-r-3 border-primary-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                  aria-current={active ? 'page' : undefined}
                  aria-label={`Navigate to ${item.name}`}
                >
                  <Icon
                    className={`flex-shrink-0 w-5 h-5 ${
                      active ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    } ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
                    aria-hidden="true"
                  />
                  {!isCollapsed && item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="px-2 mt-auto">
            <button
              onClick={onLogout}
              className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-200 keyboard-nav hover:transform hover:translate-x-1 ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? 'Logout' : undefined}
              aria-label="Logout from your account"
            >
              <ArrowRightOnRectangleIcon
                className={`flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500 ${
                  isCollapsed ? 'mx-auto' : 'mr-3'
                }`}
                aria-hidden="true"
              />
              {!isCollapsed && 'Logout'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-30 w-64 transform ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-strong animate-slide-in-left">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:rotate-3">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Campus Connect</span>
            </div>
            <button
              onClick={handleMobileToggle}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile User Info */}
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-primary-600 font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {normalizedRole} • {user.role === 'authority' && user.categories && user.categories.length > 0 
                    ? user.categories.join(', ') 
                    : user.department}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:transform hover:translate-x-1 ${
                    active
                      ? 'bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <Icon
                    className={`flex-shrink-0 w-5 h-5 mr-3 ${
                      active ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Logout */}
          <div className="px-2 py-4 border-t border-gray-200">
            <button
              onClick={() => {
                onLogout();
                setIsMobileOpen(false);
              }}
              className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-200 hover:transform hover:translate-x-1"
            >
              <ArrowRightOnRectangleIcon className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={handleMobileToggle}
          className="p-2.5 rounded-lg bg-white shadow-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-lg"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
