
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
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <Navigation />
            <AuthControls 
              onAuthClick={handleAuthClick}
              onSignOut={handleSignOut}
            />

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
