
import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  className?: string;
}

const Navigation = ({ className }: NavigationProps) => {
  return (
    <nav className={className}>
      <div className="flex items-center space-x-8">
        <a href="#features" className="text-gray-300 hover:text-white transition-colors">
          Features
        </a>
        <a href="#process" className="text-gray-300 hover:text-white transition-colors">
          How it Works
        </a>
        <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
          Pricing
        </a>
        <Link to="/testing" className="text-gray-300 hover:text-white transition-colors">
          Testing
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
