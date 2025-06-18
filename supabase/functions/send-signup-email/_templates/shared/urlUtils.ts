
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
  
  // Construct the Supabase verification URL - this is the key fix
  const resetUrl = `${supabaseUrl}/auth/v1/verify?token_hash=${encodeURIComponent(tokenHash)}&type=${emailActionType}&redirect_to=${encodeURIComponent(redirectTo)}`;
  
  console.log('Generated reset URL:', resetUrl);
  return resetUrl;
};
