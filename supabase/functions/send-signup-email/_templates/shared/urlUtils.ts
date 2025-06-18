
export const buildResetUrl = (
  supabaseUrl: string,
  tokenHash: string,
  emailActionType: string,
  redirectTo: string
): string => {
  // Validate token_hash exists and has reasonable length
  if (!tokenHash) {
    console.error('ERROR: token_hash is missing or empty');
    throw new Error('Invalid token_hash: token is required for password reset');
  }
  
  if (tokenHash.length < 10) {
    console.error('ERROR: token_hash appears to be too short:', tokenHash.length, 'characters');
    throw new Error('Invalid token_hash: token appears to be malformed');
  }
  
  console.log('Building reset URL with validated token_hash (length:', tokenHash.length, ')');
  
  // CRITICAL FIX: Use token_hash as the parameter name, not token
  // Supabase's /auth/v1/verify endpoint expects 'token_hash=' not 'token='
  const resetUrl = `${supabaseUrl}/auth/v1/verify?token_hash=${tokenHash}&type=${emailActionType}&redirect_to=${encodeURIComponent(redirectTo)}`;
  
  console.log('Generated reset URL:', resetUrl);
  return resetUrl;
};
