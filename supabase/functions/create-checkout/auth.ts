
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { logStep } from './logger.ts';

export const authenticateUser = async (
  supabaseUrl: string,
  supabaseAnonKey: string,
  authHeader: string | null
) => {
  if (!authHeader) {
    logStep("ERROR: No authorization header provided");
    throw new Error("No authorization header provided");
  }
  logStep("Authorization header found", { headerLength: authHeader.length });

  const token = authHeader.replace("Bearer ", "");
  if (!token || token === authHeader) {
    logStep("ERROR: Invalid authorization header format");
    throw new Error("Invalid authorization header format");
  }
  logStep("Token extracted", { tokenLength: token.length });

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { data, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError) {
      logStep("ERROR: Authentication failed", { error: authError.message, code: authError.status });
      throw new Error(`Authentication failed: ${authError.message}`);
    }
    
    const user = data.user;
    if (!user?.email) {
      logStep("ERROR: User not authenticated or email not available", { user: user ? "exists" : "null" });
      throw new Error("User not authenticated or email not available");
    }
    
    logStep("User authenticated", { userId: user.id, email: user.email });
    return user;
  } catch (authError) {
    logStep("ERROR: Authentication process failed", authError);
    throw new Error(`Authentication process failed: ${authError.message}`);
  }
};
