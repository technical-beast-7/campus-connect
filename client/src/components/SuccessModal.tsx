import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  role: 'student' | 'faculty' | 'authority';
  onClose: () => void;
  redirectTo?: string;
  autoRedirectSeconds?: number;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  title,
  message,
  role,
  onClose,
  redirectTo = '/dashboard',
  autoRedirectSeconds = 3
}) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = React.useState(autoRedirectSeconds);

  useEffect(() => {
    if (!isOpen) return;

    setCountdown(autoRedirectSeconds);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(redirectTo);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, autoRedirectSeconds, navigate, redirectTo]);

  const handleContinue = () => {
    onClose();
    navigate(redirectTo);
  };

  if (!isOpen) return null;

  const roleInfo = {
    student: {
      icon: '🎓',
      color: 'blue',
      description: 'You can now report issues and track their status'
    },
    faculty: {
      icon: '👨‍🏫',
      color: 'green',
      description: 'You can now report issues and track their status'
    },
    authority: {
      icon: '👮',
      color: 'purple',
      description: 'You can now manage and resolve reported issues'
    }
  };

  const info = roleInfo[role];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative animate-fade-in">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce-once">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Role Icon */}
          <div className="text-5xl mb-4">{info.icon}</div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-4">{message}</p>

          {/* Role Badge */}
          <div className={`inline-block px-4 py-2 rounded-full bg-${info.color}-100 text-${info.color}-800 font-medium text-sm mb-4`}>
            Registered as {role.charAt(0).toUpperCase() + role.slice(1)}
          </div>

          <p className="text-sm text-gray-600 mb-6">{info.description}</p>

          {/* Countdown */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Redirecting to dashboard in{' '}
              <span className="font-bold text-primary-600">{countdown}</span> seconds...
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              Continue to Dashboard
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Confetti Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '✨', '🎊', '⭐'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(500px) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
};

export default SuccessModal;
