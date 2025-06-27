
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const isMobile = useIsMobile();

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
            <span className="font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-purple-300">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}

      {/* Desktop Step Circles */}
      {!isMobile && (
        <div className="px-4">
          <div className="overflow-x-auto scrollbar-hide">
            <div className={`flex items-center justify-center min-w-max mx-auto ${
              totalSteps <= 4 ? 'gap-6' : totalSteps <= 6 ? 'gap-4' : 'gap-3'
            }`}>
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center flex-shrink-0">
                  <motion.div
                    className={`
                      rounded-full flex items-center justify-center font-medium transition-all duration-300
                      ${totalSteps <= 4 ? 'w-10 h-10 text-sm' : totalSteps <= 6 ? 'w-9 h-9 text-sm' : 'w-8 h-8 text-xs'}
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
                  {step < totalSteps && (
                    <div
                      className={`
                        mx-1 transition-all duration-300
                        ${totalSteps <= 4 ? 'w-20 h-1' : totalSteps <= 6 ? 'w-16 h-1' : 'w-12 h-0.5'}
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
                Step {currentStep} of {totalSteps}
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StepIndicator;
