import React from 'react';
import { useAuth } from '@context/AuthContext';
import DashboardUser from '@pages/DashboardUser';
import DashboardAuthority from '@pages/DashboardAuthority';
import AppLayout from '@components/AppLayout';

const Dashboard: React.FC = () => {
  const { state } = useAuth();

  // Render role-specific dashboard content
  const renderDashboardContent = () => {
    if (state.user?.role === 'authority') {
      return <DashboardAuthority />;
    } else {
      // Both students and faculty use the same dashboard
      return <DashboardUser />;
    }
  };

  return (
    <AppLayout>
      {renderDashboardContent()}
    </AppLayout>
  );
};

export default Dashboard;