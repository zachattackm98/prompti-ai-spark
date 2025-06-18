
export const buildResetUrl = (
  supabaseUrl: string,
  token: string,
  emailActionType: string,
  redirectTo: string
): string => {
  return `${supabaseUrl}/auth/v1/verify?token=${token}&type=${emailActionType}&redirect_to=${redirectTo}`;
};
