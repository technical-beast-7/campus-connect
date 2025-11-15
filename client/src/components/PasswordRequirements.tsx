import React from 'react';

interface PasswordRequirementsProps {
  password: string;
  show: boolean;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password, show }) => {
  if (!show) return null;

  const requirements = [
    {
      label: 'At least 8 characters',
      met: password.length >= 8
    },
    {
      label: 'Contains uppercase letter (A-Z)',
      met: /[A-Z]/.test(password)
    },
    {
      label: 'Contains lowercase letter (a-z)',
      met: /[a-z]/.test(password)
    },
    {
      label: 'Contains number (0-9)',
      met: /[0-9]/.test(password)
    }
  ];

  const allMet = requirements.every(req => req.met);

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
      <p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center text-xs">
            {req.met ? (
              <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={req.met ? 'text-green-700' : 'text-gray-600'}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
      {allMet && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs font-medium text-green-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Strong password!
          </p>
        </div>
      )}
    </div>
  );
};

export default PasswordRequirements;
