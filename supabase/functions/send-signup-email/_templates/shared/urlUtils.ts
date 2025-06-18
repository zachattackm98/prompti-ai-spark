
// This utility is no longer needed since we're bypassing the Supabase verify endpoint
// and handling token_hash directly in the application
export const buildResetUrl = (
  supabaseUrl: string,
  tokenHash: string,
  emailActionType: string,
  redirectTo: string
): string => {
  console.log('Building reset URL with token_hash:', tokenHash ? 'present' : 'missing');
  
  if (!tokenHash) {
    throw new Error('token_hash is required for password reset');
  }
  
  // Build direct redirect URL with token_hash as parameter
  const resetUrl = `${redirectTo}?token_hash=${encodeURIComponent(tokenHash)}&type=${emailActionType}`;
  
  console.log('Generated reset URL:', resetUrl);
  return resetUrl;
};
