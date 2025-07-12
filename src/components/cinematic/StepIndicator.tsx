
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const isMobile = useIsMobile();
  const isResultsStep = currentStep === 8;
  const displaySteps = 7; // Only show 7 numbered steps

  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Mobile Progress Bar */}
      {isMobile && (
        <div className="mb-4 px-2">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
            <span className="font-medium">
              {isResultsStep ? 'Results' : `Step ${currentStep} of ${displaySteps}`}
            </span>
            <span className="text-purple-300">
              {isResultsStep ? '100%' : Math.round((currentStep / displaySteps) * 100) + '%'}
            </span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: isResultsStep ? '100%' : `${(currentStep / displaySteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}

      {/* Desktop Step Circles */}
      {!isMobile && (
        <div className="px-2">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center justify-center min-w-max mx-auto gap-3 pb-2">
              {/* Numbered steps 1-7 */}
              {Array.from({ length: displaySteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center flex-shrink-0">
                  <motion.div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-medium transition-all duration-300 text-sm
                      ${currentStep >= step
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-slate-700 text-gray-400'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {step}
                  </motion.div>
                  {step < displaySteps && (
                    <div
                      className={`
                        w-12 h-1 mx-1 transition-all duration-300
                        ${currentStep > step 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                          : 'bg-slate-700'
                        }
                      `}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-3">
              <span className="text-gray-400 text-sm font-medium">
                {isResultsStep ? 'Results' : `Step ${currentStep} of ${displaySteps}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StepIndicator;
