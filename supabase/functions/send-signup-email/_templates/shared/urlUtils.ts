
export const buildResetUrl = (
  supabaseUrl: string,
  tokenHash: string,
  emailActionType: string,
  redirectTo: string
): string => {
  // Use token_hash for the verify endpoint - this is critical for Supabase
  // Supabase expects the token_hash parameter, not the raw token
  return `${supabaseUrl}/auth/v1/verify?token=${tokenHash}&type=${emailActionType}&redirect_to=${encodeURIComponent(redirectTo)}`;
};
