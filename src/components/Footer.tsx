import React from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${className}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-15">
        <div className="border-t border-gray-400 py-6">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Greeting Card Web | @kuntumsenda. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 