import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import { IssuesProvider } from '@context/IssueContext';
import { ROUTES } from '@utils/constants';
import ProtectedRoute from '@components/ProtectedRoute';
import { AppLayout } from '@components/layout';
import { Loader } from '@components/ui';

// Lazy load pages for better performance
const LandingPage = React.lazy(() => import('@pages/LandingPage'));
const LoginPage = React.lazy(() => import('@pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@pages/RegisterPage'));
const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const ReportIssue = React.lazy(() => import('@pages/ReportIssue'));
const MyIssues = React.lazy(() => import('@pages/MyIssues'));
const AllIssues = React.lazy(() => import('@pages/AllIssues'));
const Analytics = React.lazy(() => import('@pages/Analytics'));
const Profile = React.lazy(() => import('@pages/Profile'));
const NotFound = React.lazy(() => import('@pages/NotFound'));

// Loading fallback component
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <Loader size="lg" text="Loading page..." />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <IssuesProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path={ROUTES.HOME} element={<LandingPage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                
                {/* Protected routes */}
                <Route
                  path={ROUTES.DASHBOARD}
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.REPORT_ISSUE}
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <AppLayout>
                        <ReportIssue />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.MY_ISSUES}
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <AppLayout>
                        <MyIssues />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.ALL_ISSUES}
                  element={
                    <ProtectedRoute allowedRoles={['authority']}>
                      <AppLayout>
                        <AllIssues />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.ANALYTICS}
                  element={
                    <ProtectedRoute allowedRoles={['authority']}>
                      <AppLayout>
                        <Analytics />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.PROFILE}
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Profile />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                
                {/* 404 route - must be last */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </IssuesProvider>
    </AuthProvider>
  );
}

export default App;
