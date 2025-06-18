
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getUserFromAuth } from './auth.ts';
import { checkUsageLimit, incrementPromptCount } from './usage.ts';
import { generatePromptWithOpenAI } from './openai.ts';
import { CORS_HEADERS, TIER_LIMITS } from './constants.ts';
import type { PromptRequest } from './types.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  let user;
  let requestData: PromptRequest;

  try {
    console.log('[CINEMATIC-GENERATOR] Starting prompt generation request');
    console.log('[CINEMATIC-GENERATOR] Available tier limits:', TIER_LIMITS);
    
    requestData = await req.json();
    console.log('[CINEMATIC-GENERATOR] Request data parsed:', {
      sceneIdea: requestData.sceneIdea?.substring(0, 50) + '...',
      selectedPlatform: requestData.selectedPlatform,
      selectedEmotion: requestData.selectedEmotion,
      tier: requestData.tier || 'starter',
      isMultiScene: requestData.isMultiScene || false
    });

    const { 
      sceneIdea, 
      selectedPlatform, 
      selectedEmotion, 
      styleReference, 
      dialogSettings,
      soundSettings,
      cameraSettings,
      lightingSettings,
      tier = 'starter',
      enhancedPrompts = false,
      // Multi-scene support
      previousScenePrompts = [],
      sceneNumber = 1,
      totalScenes = 1,
      isMultiScene = false
    } = requestData;

    // Validate and log the tier being used for this request
    const validatedTier = TIER_LIMITS[tier as keyof typeof TIER_LIMITS] ? tier : 'starter';
    if (validatedTier !== tier) {
      console.warn(`[CINEMATIC-GENERATOR] Invalid tier '${tier}' provided, defaulting to 'starter'`);
    }
    console.log('[CINEMATIC-GENERATOR] User subscription tier for this request:', validatedTier, 'with limit:', TIER_LIMITS[validatedTier as keyof typeof TIER_LIMITS]);

    // Validate required fields
    if (!sceneIdea?.trim()) {
      console.error('[CINEMATIC-GENERATOR] Missing required field: sceneIdea');
      return new Response(JSON.stringify({
        error: 'VALIDATION_ERROR',
        message: 'Scene idea is required'
      }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    if (!selectedPlatform?.trim()) {
      console.error('[CINEMATIC-GENERATOR] Missing required field: selectedPlatform');
      return new Response(JSON.stringify({
        error: 'VALIDATION_ERROR',
        message: 'Platform selection is required'
      }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    console.log('[CINEMATIC-GENERATOR] Authenticating user...');
    
    try {
      user = await getUserFromAuth(authHeader);
      console.log('[CINEMATIC-GENERATOR] User authenticated:', user.id, 'for tier:', validatedTier);
    } catch (authError) {
      console.error('[CINEMATIC-GENERATOR] Authentication failed:', authError);
      return new Response(JSON.stringify({
        error: 'AUTHENTICATION_ERROR',
        message: 'Authentication failed. Please sign in again.'
      }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Check and enforce prompt limits for all tiers
    console.log('[CINEMATIC-GENERATOR] Checking usage limits for tier:', validatedTier);
    const usageCheck = await checkUsageLimit(user.id, validatedTier);
    
    if (usageCheck.exceeded) {
      console.log('[CINEMATIC-GENERATOR] Usage limit exceeded for user:', user.id, 'tier:', validatedTier);
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

    console.log('[CINEMATIC-GENERATOR] Usage check passed for tier:', validatedTier, 'generating prompt...');

    // Generate the prompt using OpenAI with multi-scene context
    // Map frontend field names to expected backend field names
    const prompt = await generatePromptWithOpenAI({
      ...requestData,
      platform: selectedPlatform,
      emotion: selectedEmotion,
      tier: validatedTier, // Use validated tier
      previousScenePrompts,
      sceneNumber,
      totalScenes,
      isMultiScene
    });

    console.log('[CINEMATIC-GENERATOR] Prompt generated successfully for tier:', validatedTier);

    // Increment prompt count for all tiers after successful generation
    console.log('[CINEMATIC-GENERATOR] Incrementing usage count for tier:', validatedTier);
    await incrementPromptCount(user.id, validatedTier);

    // Log successful generation
    console.log('[CINEMATIC-GENERATOR] Request completed successfully for user:', user.id, 'tier:', validatedTier);

    return new Response(JSON.stringify({ prompt }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[CINEMATIC-GENERATOR] Error in cinematic-prompt-generator function:', error);
    
    // Determine error type and provide appropriate response
    let errorMessage = 'An unexpected error occurred while generating your prompt.';
    let statusCode = 500;
    
    if (error.message?.includes('OpenAI')) {
      errorMessage = 'AI service is currently unavailable. Please try again in a moment.';
      statusCode = 503;
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Request timed out. Please try again with a shorter scene description.';
      statusCode = 408;
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'Service is currently experiencing high demand. Please try again in a few minutes.';
      statusCode = 429;
    }
    
    return new Response(JSON.stringify({ 
      error: 'GENERATION_ERROR',
      message: errorMessage,
      details: error.message 
    }), {
      status: statusCode,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
