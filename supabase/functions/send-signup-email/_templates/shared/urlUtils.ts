
export const buildResetUrl = (
  supabaseUrl: string,
  token: string,
  emailActionType: string,
  redirectTo: string
): string => {
  // Use token_hash for the verify endpoint, not token
  // This is the key issue - Supabase expects token_hash in the URL
  return `${supabaseUrl}/auth/v1/verify?token=${token}&type=${emailActionType}&redirect_to=${encodeURIComponent(redirectTo)}`;
};
