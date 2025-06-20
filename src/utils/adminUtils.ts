
/**
 * Check if the current user is an admin user
 * Currently configured for zachm98@hotmail.com
 */
export const isAdminUser = (userEmail: string | undefined): boolean => {
  if (!userEmail) return false;
  return userEmail.toLowerCase() === 'zachm98@hotmail.com';
};
