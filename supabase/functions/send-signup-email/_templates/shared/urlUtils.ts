
export const buildResetUrl = (
  supabaseUrl: string,
  tokenHash: string,
  emailActionType: string,
  redirectTo: string
): string => {
  // Comprehensive token_hash validation
  if (!tokenHash) {
    console.error('ERROR: token_hash is missing or empty');
    throw new Error('Invalid token_hash: token is required for password reset');
  }
  
  if (typeof tokenHash !== 'string') {
    console.error('ERROR: token_hash is not a string, type:', typeof tokenHash);
    throw new Error('Invalid token_hash: token must be a string');
  }
  
  if (tokenHash.length < 10) {
    console.error('ERROR: token_hash appears to be too short:', tokenHash.length, 'characters');
    throw new Error('Invalid token_hash: token appears to be malformed');
  }
  
  // Additional validation for expected token format
  if (!tokenHash.match(/^[a-zA-Z0-9_-]+$/)) {
    console.error('ERROR: token_hash contains invalid characters');
    console.error('Token preview:', tokenHash.substring(0, 20) + '...');
    throw new Error('Invalid token_hash: token contains invalid characters');
  }
  
  console.log('Building reset URL with validated token_hash (length:', tokenHash.length, ')');
  console.log('Token preview:', tokenHash.substring(0, 20) + '...');
  
  // Properly encode the token_hash to handle any special characters
  const encodedTokenHash = encodeURIComponent(tokenHash);
  const encodedRedirectTo = encodeURIComponent(redirectTo);
  
  // CRITICAL FIX: Use token_hash as the parameter name, not token
  // Supabase's /auth/v1/verify endpoint expects 'token_hash=' not 'token='
  const resetUrl = `${supabaseUrl}/auth/v1/verify?token_hash=${encodedTokenHash}&type=${emailActionType}&redirect_to=${encodedRedirectTo}`;
  
  console.log('Generated reset URL (first 100 chars):', resetUrl.substring(0, 100) + '...');
  
  // Validate the URL structure
  try {
    const urlObj = new URL(resetUrl);
    const extractedTokenHash = urlObj.searchParams.get('token_hash');
    if (extractedTokenHash !== tokenHash) {
      console.error('URL validation FAILED: token_hash parameter mismatch');
      console.error('Original:', tokenHash.substring(0, 20) + '...');
      console.error('Extracted:', extractedTokenHash?.substring(0, 20) + '...');
      throw new Error('URL construction failed: token_hash parameter is corrupted');
    }
    console.log('URL validation PASSED: token_hash parameter matches original');
  } catch (urlError) {
    console.error('URL validation ERROR:', urlError);
    throw new Error('Invalid URL construction: ' + urlError.message);
  }
  
  return resetUrl;
};
