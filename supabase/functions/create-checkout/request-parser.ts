
import { logStep } from './logger.ts';
import { CheckoutRequest } from './types.ts';

export const parseRequestBody = async (req: Request): Promise<CheckoutRequest> => {
  try {
    logStep("Reading request body...");
    
    const bodyText = await req.text();
    logStep("Raw request body", { length: bodyText.length, body: bodyText.substring(0, 200) });
    
    if (!bodyText || bodyText.trim() === '') {
      logStep("ERROR: Empty request body received");
      throw new Error("Request body is empty");
    }

    const requestBody = JSON.parse(bodyText);
    logStep("Request body parsed successfully", requestBody);

    const planType = requestBody.planType;
    if (!planType) {
      logStep("ERROR: No planType provided", requestBody);
      throw new Error("planType is required in request body");
    }
    
    if (!['creator', 'studio'].includes(planType)) {
      logStep("ERROR: Invalid planType", { planType });
      throw new Error(`Invalid planType: ${planType}. Must be 'creator' or 'studio'`);
    }
    
    logStep("Plan type validated", { planType });
    return { planType };
  } catch (parseError) {
    logStep("ERROR: Request body parsing failed", { error: parseError.message });
    throw new Error(`Failed to parse request body: ${parseError.message}`);
  }
};
