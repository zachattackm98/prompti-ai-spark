
import { LogDetails } from './types.ts';

export const logStep = (step: string, details?: LogDetails) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};
