import type { PromptRequest, GeneratedPrompt } from './types.ts';
import { USE_LEGACY_APPROACH } from './constants.ts';
import { generatePromptWithOpenAILegacy } from './openai-legacy.ts';
import { generatePromptWithBot } from './bot-api.ts';

export async function generatePromptWithOpenAI(request: PromptRequest): Promise<GeneratedPrompt> {
  // Use environment variable to switch between approaches
  if (USE_LEGACY_APPROACH) {
    console.log('Using legacy OpenAI approach');
    return generatePromptWithOpenAILegacy(request);
  } else {
    console.log('Using streamlined bot approach');
    try {
      return await generatePromptWithBot(request);
    } catch (error) {
      console.error('Bot approach failed, falling back to legacy:', error);
      console.log('Falling back to legacy OpenAI approach');
      return generatePromptWithOpenAILegacy(request);
    }
  }
}