
import React from 'react';
import { CreditCard } from 'lucide-react';

interface BillingCycleProps {
  subscription: any;
}

const BillingCycle = ({ subscription }: BillingCycleProps) => {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-400 mb-3">Billing Cycle</h4>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white">
          <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm">Monthly Billing</span>
        </div>
        {subscription.expiresAt && (
          <div className="text-xs text-gray-400">
            Next billing: {new Date(subscription.expiresAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingCycle;
