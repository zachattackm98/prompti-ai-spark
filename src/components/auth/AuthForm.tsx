
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import FormField from './FormField';

interface AuthFormProps {
  isLogin: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  fullName: string;
  setFullName: (fullName: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
}

const AuthForm = ({
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  showPassword,
  setShowPassword,
  loading,
  onSubmit,
  onForgotPassword
}: AuthFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {!isLogin && (
        <FormField
          id="fullName"
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          required={!isLogin}
          icon={<User className="w-4 h-4" />}
        />
      )}

      <FormField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        icon={<Mail className="w-4 h-4" />}
      />

      <FormField
        id="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
        icon={<Lock className="w-4 h-4" />}
        showPasswordToggle
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        toggleIcon={
          showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )
        }
      />

      {isLogin && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="link"
            onClick={onForgotPassword}
            className="text-purple-400 hover:text-purple-300 p-0 h-auto text-sm"
          >
            Forgot Password?
          </Button>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
      </Button>
    </form>
  );
};

export default AuthForm;
