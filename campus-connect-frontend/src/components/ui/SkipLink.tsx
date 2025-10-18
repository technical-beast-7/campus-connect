import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="skip-link focus-visible:focus-visible"
      onClick={(e) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }}
    >
      {children}
    </a>
  );
};

export default SkipLink;