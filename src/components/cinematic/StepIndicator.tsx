
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const isMobile = useIsMobile();

  // Mobile-first responsive classes
  const getResponsiveClasses = () => {
    if (isMobile) {
      return {
        stepSize: "w-8 h-8",
        connector: "w-8 h-0.5",
        textSize: "text-xs",
        spacing: "gap-1"
      };
    }
    
    if (totalSteps <= 4) {
      return {
        stepSize: "w-10 h-10",
        connector: "w-20 h-1",
        textSize: "text-sm",
        spacing: "gap-6"
      };
    } else if (totalSteps <= 6) {
      return {
        stepSize: "w-9 h-9",
        connector: "w-16 h-1",
        textSize: "text-sm",
        spacing: "gap-4"
      };
    } else {
      return {
        stepSize: "w-8 h-8",
        connector: "w-12 h-0.5",
        textSize: "text-xs",
        spacing: "gap-3"
      };
    }
  };

  const classes = getResponsiveClasses();

  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Progress bar for mobile */}
      {isMobile && (
        <div className="mb-4 px-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Step {currentStep}</span>
            <span>{totalSteps} Steps</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}

      {/* Step circles - responsive layout */}
      <div className={isMobile ? "px-2" : "px-4"}>
        <div className="overflow-x-auto scrollbar-hide">
          <div className={`flex items-center justify-center min-w-max mx-auto ${classes.spacing}`}>
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center flex-shrink-0">
                <motion.div
                  className={`${classes.stepSize} rounded-full flex items-center justify-center ${classes.textSize} font-medium transition-all duration-300 ${
                    currentStep >= step
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-slate-700 text-gray-400'
                  }`}
                  whileHover={{ scale: isMobile ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {step}
                </motion.div>
                {step < totalSteps && (
                  <div
                    className={`${classes.connector} mx-1 transition-all duration-300 ${
                      currentStep > step 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                        : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Step counter text - only show on desktop */}
        {!isMobile && (
          <div className="text-center mt-3">
            <span className={`text-gray-400 ${classes.textSize} font-medium`}>
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StepIndicator;
