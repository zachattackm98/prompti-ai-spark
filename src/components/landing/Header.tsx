
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthDialog from '../AuthDialog';
import Logo from './Logo';
import Navigation from './Navigation';
import AuthControls from './AuthControls';
import MobileMenu from './MobileMenu';

const Header = () => {
  const { signOut } = useAuth();
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
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Desktop Navigation - Only visible on larger screens */}
            <div className="hidden lg:flex flex-1 justify-center">
              <Navigation />
            </div>

            {/* Desktop Auth Controls */}
            <div className="hidden md:flex flex-shrink-0">
              <AuthControls 
                onAuthClick={handleAuthClick}
                onSignOut={handleSignOut}
              />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 p-2 h-9 w-9"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <MobileMenu 
            isOpen={mobileMenuOpen}
            onAuthClick={handleAuthClick}
            onSignOut={handleSignOut}
            onClose={() => setMobileMenuOpen(false)}
          />
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
