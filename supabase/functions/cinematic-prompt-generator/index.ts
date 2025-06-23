
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getUserFromAuth, supabase } from './auth.ts';
import { checkUsageLimit, incrementPromptCount } from './usage.ts';
import { generatePromptWithOpenAI } from './openai.ts';
import { CORS_HEADERS } from './constants.ts';
import type { PromptRequest } from './types.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const requestData: PromptRequest = await req.json();
    const { 
      sceneIdea, 
      platform, 
      emotion, 
      styleReference, 
      dialogSettings,
      soundSettings,
      cameraSettings,
      lightingSettings,
      tier = 'starter',
      enhancedPrompts = false,
      // Multi-scene support
      sceneContext,
      sceneNumber = 1,
      totalScenes = 1,
      isMultiScene = false,
      // Mode-specific fields
      mode = 'creative',
      animalType,
      selectedVibe,
      hasDialogue,
      dialogueContent
    } = requestData;

    console.log('Processing prompt request for mode:', mode);

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    const user = await getUserFromAuth(authHeader);

    // Check and enforce prompt limits for all tiers
    const usageCheck = await checkUsageLimit(user.id, tier);
    
    if (usageCheck.exceeded) {
      return new Response(JSON.stringify({
        error: usageCheck.error,
        message: usageCheck.message,
        currentUsage: usageCheck.currentUsage,
        limit: usageCheck.limit,
        tier: usageCheck.tier
      }), {
        status: 429,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Generate the prompt using OpenAI with mode and multi-scene context
    const prompt = await generatePromptWithOpenAI({
      ...requestData,
      sceneContext,
      sceneNumber,
      totalScenes,
      isMultiScene,
      mode,
      animalType,
      selectedVibe,
      hasDialogue,
      dialogueContent
    });

    // Increment prompt count for all tiers after successful generation
    await incrementPromptCount(user.id, tier);

    // Save to prompt history with mode metadata
    try {
      await supabase
        .from('prompt_history')
        .insert({
          user_id: user.id,
          scene_idea: sceneIdea,
          platform: platform,
          style: styleReference || '',
          emotion: emotion,
          generated_prompt: JSON.stringify({
            ...prompt,
            mode,
            animalType: mode === 'animal-vlog' ? animalType : null,
            selectedVibe: mode === 'animal-vlog' ? selectedVibe : null,
            hasDialogue: mode === 'animal-vlog' ? hasDialogue : null,
            dialogueContent: mode === 'animal-vlog' && hasDialogue ? dialogueContent : null
          })
        });
    } catch (dbError) {
      console.error('Error saving to prompt history:', dbError);
      // Continue anyway - don't fail the request if saving fails
    }

    return new Response(JSON.stringify({ prompt }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in cinematic-prompt-generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
