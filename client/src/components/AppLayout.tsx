import React from 'react';
import { useAuth } from '@context/AuthContext';
import Sidebar from '@components/Sidebar';
import Footer from '@components/Footer';
import Loader from '@components/Loader';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { state, logout } = useAuth();

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load user information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar user={state.user} onLogout={logout} />
      
      {/* Main Content */}
      <main id="main-content" className="flex-1 lg:ml-64 overflow-auto flex flex-col" role="main" tabIndex={-1}>
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default AppLayout;
