import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ExclamationTriangleIcon, 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { ROUTES } from '../utils/constants';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: ExclamationTriangleIcon,
      title: 'Easy Issue Reporting',
      description: 'Report campus issues quickly with our intuitive form. Add photos, select categories, and track progress in real-time.'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Real-time Communication',
      description: 'Stay updated with comments and status changes. Authorities can communicate directly with reporters.'
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics Dashboard',
      description: 'Authorities get comprehensive analytics to identify patterns and improve campus services.'
    },
    {
      icon: ClockIcon,
      title: 'Quick Resolution',
      description: 'Streamlined workflow ensures issues are addressed promptly with clear status tracking.'
    },
    {
      icon: UserGroupIcon,
      title: 'Role-based Access',
      description: 'Different interfaces for students, faculty, and authorities with appropriate permissions.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Reliable',
      description: 'Your data is protected with modern security practices and reliable infrastructure.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:rotate-3 hover:scale-110">
                <span className="text-white font-bold text-lg">CC</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Campus Connect</span>
                <div className="text-xs text-gray-500 -mt-1 hidden sm:block">Issue Management</div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link
                to={ROUTES.LOGIN}
                className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-200 px-3 py-2 rounded-md hover:bg-primary-50"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Connect Your Campus
              <span className="block text-gradient animate-float">Resolve Issues Together</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Campus Connect is your comprehensive platform for reporting, tracking, and resolving campus issues. 
              From maintenance requests to facility concerns, we bring students, faculty, and authorities together 
              for a better campus experience.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link
                to={ROUTES.REGISTER}
                className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 text-lg"
              >
                Start Reporting Issues
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-primary-600 font-semibold py-4 px-8 rounded-xl border-2 border-primary-600 hover:border-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 text-lg"
              >
                Login to Dashboard
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-center hover:transform hover:scale-110 transition-all duration-200">
                <div className="text-3xl font-bold text-gradient mb-2 animate-pulse-gentle">500+</div>
                <div className="text-gray-600 font-medium">Issues Resolved</div>
              </div>
              <div className="text-center hover:transform hover:scale-110 transition-all duration-200">
                <div className="text-3xl font-bold text-gradient mb-2 animate-pulse-gentle" style={{ animationDelay: '0.5s' }}>1000+</div>
                <div className="text-gray-600 font-medium">Active Users</div>
              </div>
              <div className="text-center hover:transform hover:scale-110 transition-all duration-200">
                <div className="text-3xl font-bold text-gradient mb-2 animate-pulse-gentle" style={{ animationDelay: '1s' }}>24h</div>
                <div className="text-gray-600 font-medium">Avg Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Campus Connect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to make campus issue management simple, efficient, and transparent for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-soft hover:shadow-strong transition-all duration-300 border border-gray-100 hover:border-primary-200 group transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mb-6 group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-200 group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-md">
                  <feature.icon className="w-6 h-6 text-primary-600 group-hover:text-primary-700 transition-colors duration-200" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started with Campus Connect is simple. Follow these easy steps to report and track issues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 hover:rotate-3">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Create Account
              </h3>
              <p className="text-gray-600">
                Register with your role (student, faculty, or authority) and department information.
              </p>
            </div>

            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 hover:rotate-3">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Report Issues
              </h3>
              <p className="text-gray-600">
                Submit detailed issue reports with photos, categories, and descriptions for quick resolution.
              </p>
            </div>

            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 hover:rotate-3">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Track Progress
              </h3>
              <p className="text-gray-600">
                Monitor your issues in real-time and receive updates as authorities work on resolutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Improve Your Campus?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students, faculty, and staff who are already using Campus Connect 
            to make their campus a better place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <Link
              to={ROUTES.REGISTER}
              className="bg-white hover:bg-gray-100 text-primary-600 font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105"
            >
              Get Started Today
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="bg-gradient-to-r from-primary-700 to-primary-800 hover:from-primary-800 hover:to-primary-900 text-white font-semibold py-4 px-8 rounded-xl border-2 border-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105"
            >
              Login Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;