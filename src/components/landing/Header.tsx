
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import AuthDialog from '../AuthDialog';

const Header = () => {
  const { user, signOut } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 border-b border-white/20 will-change-transform"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg"></div>
            <span className="text-xl font-bold text-white">Prompti.ai</span>
          </motion.div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Pricing
            </a>
            <a 
              href="#faq" 
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              FAQ
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-300 text-sm">Welcome, {user.email}</span>
                <Button 
                  onClick={handleSignOut}
                  variant="ghost" 
                  className="text-white hover:bg-white/10 transition-all duration-300"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setShowAuthDialog(true)}
                  variant="ghost" 
                  className="text-white hover:bg-white/10 transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => setShowAuthDialog(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Try Prompti.ai
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.header>

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    </>
  );
};

export default Header;
