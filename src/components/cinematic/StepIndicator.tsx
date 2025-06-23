
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const isMobile = useIsMobile();

  const stepVariants = {
    inactive: { 
      scale: 1, 
      backgroundColor: "rgba(51, 65, 85, 1)",
      borderColor: "rgba(100, 116, 139, 0.3)"
    },
    active: { 
      scale: 1.1, 
      backgroundColor: "rgba(147, 51, 234, 1)",
      borderColor: "rgba(147, 51, 234, 0.8)"
    },
    completed: { 
      scale: 1, 
      backgroundColor: "rgba(34, 197, 94, 1)",
      borderColor: "rgba(34, 197, 94, 0.8)"
    }
  };

  const getStepState = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'active';
    return 'inactive';
  };

  return (
    <motion.div 
      className="w-full max-w-full overflow-hidden mb-6 sm:mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Mobile Progress Bar */}
      {isMobile && (
        <div className="w-full max-w-full overflow-hidden px-2 sm:px-4">
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="font-medium text-white">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-purple-300 font-semibold">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          
          <div className="relative w-full max-w-full">
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 h-full rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </motion.div>
            </div>
            
            {/* Step markers on mobile */}
            <div className="absolute top-0 w-full h-3 flex justify-between">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <motion.div
                  key={step}
                  className={`w-1 h-3 rounded-full ${
                    step <= currentStep ? 'bg-white/40' : 'bg-slate-600/40'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * step, duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Step Circles */}
      {!isMobile && (
        <div className="w-full max-w-full overflow-hidden px-2 sm:px-4">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className={`
              flex items-center justify-center min-w-max mx-auto
              ${totalSteps <= 4 ? 'gap-8' : totalSteps <= 6 ? 'gap-6' : 'gap-4'}
            `}>
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center flex-shrink-0">
                  <motion.div
                    className={`
                      relative rounded-full flex items-center justify-center font-semibold
                      border-2 backdrop-blur-sm transition-all duration-300
                      ${totalSteps <= 4 ? 'w-12 h-12 text-sm' : totalSteps <= 6 ? 'w-11 h-11 text-sm' : 'w-10 h-10 text-xs'}
                    `}
                    variants={stepVariants}
                    animate={getStepState(step)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {/* Glow effect for active step */}
                    {step === currentStep && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-purple-500/30 blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    <span className="relative z-10 text-white">
                      {step}
                    </span>
                    
                    {/* Completion checkmark */}
                    {step < currentStep && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center text-white text-xs"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {step < totalSteps && (
                    <motion.div
                      className={`
                        mx-2 transition-all duration-500
                        ${totalSteps <= 4 ? 'w-24 h-1' : totalSteps <= 6 ? 'w-20 h-1' : 'w-16 h-0.5'}
                        rounded-full relative overflow-hidden
                      `}
                      style={{
                        background: step < currentStep 
                          ? 'linear-gradient(90deg, #10b981, #059669)' 
                          : 'rgba(51, 65, 85, 0.5)'
                      }}
                    >
                      {/* Animated progress fill */}
                      {step < currentStep && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 1, delay: 0.2 * step }}
                        />
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
            
            <motion.div 
              className="text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <span className="text-slate-300 text-sm font-medium">
                Step {currentStep} of {totalSteps}
              </span>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StepIndicator;
