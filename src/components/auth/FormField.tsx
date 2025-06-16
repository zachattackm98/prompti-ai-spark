
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  icon: React.ReactNode;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  toggleIcon?: React.ReactNode;
}

const FormField = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  icon,
  showPasswordToggle = false,
  showPassword,
  onTogglePassword,
  toggleIcon
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-white flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className={`bg-slate-800 border-white/20 text-white placeholder:text-gray-400 ${
            showPasswordToggle ? 'pr-10' : ''
          }`}
          placeholder={placeholder}
          required={required}
        />
        {showPasswordToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={onTogglePassword}
          >
            {toggleIcon}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormField;
