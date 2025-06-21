
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Video } from 'lucide-react';
import { fadeInVariants, staggerContainer, scaleInVariants } from '@/utils/animations';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import VideoDialog from '@/components/VideoDialog';
import { useUserProfile } from '@/hooks/useUserProfile';

interface HeroProps {
  user?: any;
  subscription?: any;
  showPersonalized?: boolean;
}

const Hero: React.FC<HeroProps> = ({ user, subscription, showPersonalized = true }) => {
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { firstName } = useUserProfile(user || authUser);

  // Use passed props or fall back to auth context
  const currentUser = user || authUser;

  const handleScrollToGenerator = () => {
    if (currentUser) {
      // Redirect authenticated users to the generate page
      navigate('/generate');
    } else {
      // For non-authenticated users, scroll to the generator on this page
      const generatorSection = document.getElementById('cinematic-generator');
      if (generatorSection) {
        generatorSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const handleWatchDemo = () => {
    setShowVideoDialog(true);
  };

  // Determine what content to show based on showPersonalized prop
  const shouldShowPersonalized = showPersonalized && currentUser && firstName;

  return (
    <>
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.div 
              variants={scaleInVariants}
              className="inline-flex items-center space-x-2 bg-slate-900/80 border border-purple-500/20 rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8 will-change-transform text-xs sm:text-sm"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <span className="text-gray-300">Transform ideas into cinematic prompts</span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInVariants}
              className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            >
              {shouldShowPersonalized ? (
                <>
                  Welcome Back,
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> {firstName}!</span>
                </>
              ) : (
                <>
                  Turn Your
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Vision </span>
                  Into Video Magic
                </>
              )}
            </motion.h1>
            
            <motion.p 
              variants={fadeInVariants}
              className="text-base sm:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
            >
              {shouldShowPersonalized && subscription ? (
                <div className="space-y-2">
                  <p>Ready to create amazing video prompts?</p>
                  <p className="text-sm text-purple-300">
                    You're on the <span className="capitalize font-medium">{subscription.tier}</span> plan
                  </p>
                </div>
              ) : (
                "Generate professional, cinematic prompts for Sora, Runway, Pika, and Veo. From simple ideas to structured masterpieces in seconds."
              )}
            </motion.p>
            
            <motion.div 
              variants={fadeInVariants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0"
            >
              <Button 
                size="lg" 
                onClick={handleScrollToGenerator}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 transition-all duration-300"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {currentUser ? 'Go to Generator' : 'Build My First Prompt'}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleWatchDemo}
                className="w-full sm:w-auto border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 hover:text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 transition-all duration-300"
              >
                <Video className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
            
            <motion.div 
              variants={fadeInVariants}
              className="mt-12 sm:mt-16 relative px-4 sm:px-0"
            >
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-8 max-w-3xl mx-auto backdrop-blur-sm">
                <div className="bg-gray-900/70 rounded-xl p-4 sm:p-6 font-mono text-xs sm:text-sm">
                  <div className="text-purple-400 mb-2">// Generated Prompt</div>
                  <div className="text-gray-300 leading-relaxed space-y-1">
                    <div><span className="text-pink-400">SHOT:</span> Wide cinematic establishing shot</div>
                    <div><span className="text-pink-400">SCENE:</span> A lone astronaut walking across a vast alien desert at golden hour</div>
                    <div><span className="text-pink-400">MOOD:</span> Epic, contemplative, mysterious</div>
                    <div><span className="text-pink-400">STYLE:</span> Denis Villeneuve aesthetic, 35mm film grain</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <VideoDialog 
        open={showVideoDialog} 
        onOpenChange={setShowVideoDialog}
      />
    </>
  );
};

export default Hero;
