
import React from 'react';
import { Button } from '@/components/ui/button';

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthToggle = ({ isLogin, onToggle }: AuthToggleProps) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-gray-400">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
      </p>
      <Button
        variant="link"
        onClick={onToggle}
        className="text-purple-400 hover:text-purple-300"
      >
        {isLogin ? 'Sign up' : 'Sign in'}
      </Button>
    </div>
  );
};

export default AuthToggle;
