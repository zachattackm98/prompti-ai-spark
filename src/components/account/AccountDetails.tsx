
import React from 'react';
import { User, Calendar } from 'lucide-react';

interface AccountDetailsProps {
  user: any;
  subscription: any;
}

const AccountDetails = ({ user, subscription }: AccountDetailsProps) => {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-400 mb-3">Account Details</h4>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm truncate">{user?.email}</span>
        </div>
        {subscription.expiresAt && (
          <div className="flex items-start gap-2 text-white">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm">
              Renews {new Date(subscription.expiresAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDetails;
