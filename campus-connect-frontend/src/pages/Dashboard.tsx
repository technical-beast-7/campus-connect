import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardStudent from './DashboardStudent';
import DashboardAuthority from './DashboardAuthority';
import AppLayout from '../components/layout/AppLayout';

const Dashboard: React.FC = () => {
  const { state } = useAuth();

  // Render role-specific dashboard content
  const renderDashboardContent = () => {
    if (state.user?.role === 'authority') {
      return <DashboardAuthority />;
    } else {
      return <DashboardStudent />;
    }
  };

  return (
    <AppLayout>
      {renderDashboardContent()}
    </AppLayout>
  );
};

export default Dashboard;