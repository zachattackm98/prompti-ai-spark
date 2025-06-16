
import React from 'react';

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h1>
      <p className="text-gray-400">
        {isLogin ? 'Sign in to access ChatGPT' : 'Sign up to get started'}
      </p>
    </div>
  );
};

export default AuthHeader;
