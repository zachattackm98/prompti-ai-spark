
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import AuthDialog from '../AuthDialog';

const Header = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    setShowAuthDialog(true);
    setMobileMenuOpen(false);
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
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg"></div>
              <span className="text-lg sm:text-xl font-bold text-white">AiPromptMachine</span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
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
            
            {/* Desktop Auth Controls */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              {user ? (
                <>
                  <a 
                    href="/account"
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm hidden lg:block"
                  >
                    Account
                  </a>
                  <div className="text-gray-300 text-sm hidden lg:block">
                    Welcome, {user.email.length > 20 ? user.email.substring(0, 20) + '...' : user.email}
                  </div>
                  <Button 
                    onClick={handleSignOut}
                    variant="outline" 
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 bg-slate-800/40 transition-all duration-300 px-2 lg:px-4"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={handleAuthClick}
                    variant="outline" 
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 bg-slate-800/40 transition-all duration-300 px-2 lg:px-4"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={handleAuthClick}
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 px-2 lg:px-4 text-xs lg:text-sm"
                  >
                    Try Now
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/10 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-white/10"
            >
              <div className="flex flex-col space-y-4 pt-4">
                <a 
                  href="#features" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#pricing" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a 
                  href="#faq" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </a>
                
                <div className="border-t border-white/10 pt-4 space-y-3">
                  {user ? (
                    <>
                      <a 
                        href="/account"
                        className="block text-gray-300 hover:text-white transition-colors duration-300 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Account
                      </a>
                      <div className="text-gray-300 text-sm py-2">
                        Welcome, {user.email}
                      </div>
                      <Button 
                        onClick={handleSignOut}
                        variant="outline" 
                        size="sm"
                        className="w-full border-white/20 text-white hover:bg-white/10 bg-slate-800/40"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        onClick={handleAuthClick}
                        variant="outline" 
                        size="sm"
                        className="w-full border-white/20 text-white hover:bg-white/10 bg-slate-800/40"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={handleAuthClick}
                        size="sm"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                      >
                        Try AiPromptMachine
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
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
