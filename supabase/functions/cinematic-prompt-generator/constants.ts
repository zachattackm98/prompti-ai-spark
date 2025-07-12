
export const TIER_LIMITS = {
  starter: 5,
  creator: 500,
  studio: 1000
} as const;

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
} as const;

// Configuration for switching between approaches
// Default to bot approach (false) unless explicitly set to true
export const USE_LEGACY_APPROACH = Deno.env.get('USE_LEGACY_APPROACH') === 'true';

// Bot API configuration
export const BOT_ID = 'pmpt_6871afe3e2488195b4f42067f15f9a200933641e7fae9214';

export const PLATFORM_PROMPTS = {
  'veo3': {
    system: "You are an expert in Veo3 AI video generation. Create production-quality prompts optimized for Veo3's cinematic realism capabilities, focusing on photorealistic scenes, professional cinematography, and cinematic storytelling.",
    technical: "4K resolution, cinematic realism, photorealistic rendering, professional lighting, smooth camera movements, 16:9 aspect ratio"
  },
  'sora': {
    system: "You are an expert in Sora AI video generation. Create detailed prompts that leverage Sora's photorealism strengths, emphasizing realistic physics, natural lighting, and lifelike character movements.",
    technical: "Photorealistic quality, natural physics simulation, realistic lighting and shadows, high-definition detail, temporal consistency"
  },
  'runway': {
    system: "You are an expert in Runway AI video generation. Create artistic prompts optimized for Runway's painterly style capabilities, focusing on creative visual effects, artistic rendering, and stylized cinematography.",
    technical: "Painterly style rendering, artistic visual effects, creative color grading, stylized motion, enhanced artistic flair"
  },
  'pika': {
    system: "You are an expert in Pika AI video generation. Create engaging prompts perfect for Pika's quick loops and stylized video generation, focusing on dynamic movements, social media optimization, and eye-catching visuals.",
    technical: "Quick loop format, stylized rendering, dynamic motion, social media optimized, engaging visual effects, short-form content"
  }
} as const;
