
import React from 'react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <motion.div 
      className="mb-6 sm:mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-center space-x-2 sm:space-x-4">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${
                currentStep >= step
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-slate-700 text-gray-400'
              }`}
            >
              {step}
            </div>
            {step < totalSteps && (
              <div
                className={`w-8 sm:w-16 h-0.5 sm:h-1 mx-1 sm:mx-2 transition-all ${
                  currentStep > step ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-2 text-gray-400 text-xs sm:text-sm">
        Step {currentStep} of {totalSteps}
      </div>
    </motion.div>
  );
};

export default StepIndicator;
