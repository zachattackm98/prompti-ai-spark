
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  full_name: string | null;
  email: string | null;
}

export const useUserProfile = (user: User | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error('Error fetching profile:', error);
        }

        setProfile(data || { full_name: null, email: user.email });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile({ full_name: null, email: user.email });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Extract first name for greeting
  const getFirstName = () => {
    if (!user) return null;
    
    // Try profile full_name first
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    
    // Try user metadata
    const metaName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (metaName) {
      return metaName.split(' ')[0];
    }
    
    // Fallback to email prefix
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'there';
  };

  return {
    profile,
    loading,
    firstName: getFirstName()
  };
};
