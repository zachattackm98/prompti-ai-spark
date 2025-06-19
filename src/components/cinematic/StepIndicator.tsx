
import React from 'react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  // Calculate dynamic spacing based on screen size and number of steps
  const getResponsiveClasses = () => {
    if (totalSteps <= 4) {
      return {
        container: "space-x-3 sm:space-x-6",
        stepSize: "w-8 h-8 sm:w-10 sm:h-10",
        connector: "w-12 sm:w-20 h-0.5 sm:h-1",
        textSize: "text-xs sm:text-sm"
      };
    } else if (totalSteps <= 6) {
      return {
        container: "space-x-2 sm:space-x-4",
        stepSize: "w-7 h-7 sm:w-9 sm:h-9",
        connector: "w-8 sm:w-16 h-0.5 sm:h-1",
        textSize: "text-xs sm:text-sm"
      };
    } else {
      return {
        container: "space-x-1 sm:space-x-3",
        stepSize: "w-6 h-6 sm:w-8 sm:h-8",
        connector: "w-6 sm:w-12 h-0.5",
        textSize: "text-[10px] sm:text-xs"
      };
    }
  };

  const classes = getResponsiveClasses();

  return (
    <motion.div 
      className="mb-4 sm:mb-6 px-2 sm:px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Scrollable container for mobile overflow */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className={`flex items-center justify-center min-w-max mx-auto ${classes.container}`}>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center flex-shrink-0">
              <div
                className={`${classes.stepSize} rounded-full flex items-center justify-center ${classes.textSize} font-medium transition-all duration-300 ${
                  currentStep >= step
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-slate-700 text-gray-400'
                }`}
              >
                {step}
              </div>
              {step < totalSteps && (
                <div
                  className={`${classes.connector} mx-1 sm:mx-2 transition-all duration-300 ${
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
      
      {/* Step counter text */}
      <div className="text-center mt-2 sm:mt-3">
        <span className={`text-gray-400 ${classes.textSize} font-medium`}>
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </motion.div>
  );
};

export default StepIndicator;
