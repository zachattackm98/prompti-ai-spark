
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tier limits
const TIER_LIMITS = {
  starter: 5,
  creator: 500,
  studio: 1000
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      sceneIdea, 
      platform, 
      emotion, 
      styleReference, 
      cameraSettings,
      lightingSettings,
      tier = 'starter',
      enhancedPrompts = false
    } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Check and enforce prompt limits for all tiers
    const tierLimit = TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS.starter;
    console.log(`Checking prompt usage for ${tier} user:`, user.id, 'limit:', tierLimit);
    
    // Get current usage for this user
    const { data: usageData, error: usageError } = await supabase
      .rpc('get_or_create_prompt_usage', { user_uuid: user.id });

    if (usageError) {
      console.error('Error getting prompt usage:', usageError);
      throw new Error('Failed to check prompt usage');
    }

    console.log('Current prompt usage:', usageData);

    // Check if user has exceeded the limit
    if (usageData && usageData.prompt_count >= tierLimit) {
      const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
      let upgradeMessage = '';
      
      if (tier === 'starter') {
        upgradeMessage = 'Upgrade to Creator (500 prompts/month) or Studio (1000 prompts/month) plan for more prompts.';
      } else if (tier === 'creator') {
        upgradeMessage = 'Upgrade to Studio plan for 1000 prompts per month.';
      } else {
        upgradeMessage = 'You have reached your monthly limit. Your usage will reset next month.';
      }
      
      return new Response(JSON.stringify({ 
        error: 'USAGE_LIMIT_EXCEEDED',
        message: `You have reached your monthly limit of ${tierLimit} prompts on the ${tierName} plan. ${upgradeMessage}`,
        currentUsage: usageData.prompt_count,
        limit: tierLimit,
        tier: tier
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Platform-specific system prompts with updated platforms
    const platformPrompts = {
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
    };

    const selectedPlatform = platformPrompts[platform as keyof typeof platformPrompts] || platformPrompts.veo3;

    // Build enhanced system prompt based on tier and features
    let systemPrompt = `${selectedPlatform.system}

Your task is to transform user scene ideas into three distinct components:

1. MAIN PROMPT: A detailed, cinematic description optimized for AI video generation
2. TECHNICAL SPECS: Platform-specific technical parameters and settings
3. STYLE NOTES: Visual style, mood, and artistic direction

Guidelines:
- Use specific cinematography terms (wide shot, close-up, dolly zoom, etc.)
- Include detailed lighting descriptions (golden hour, dramatic shadows, etc.)
- Specify camera movements and angles
- Mention color palettes and mood
- Keep prompts under 200 words each section
- Make it production-ready and professional

Current scene emotion/mood: ${emotion}
User subscription tier: ${tier.toUpperCase()}`;

    // Add enhanced features for higher tiers
    if (cameraSettings && (cameraSettings.angle || cameraSettings.movement || cameraSettings.shot)) {
      systemPrompt += `\n\nCAMERA SPECIFICATIONS:
- Camera Angle: ${cameraSettings.angle || 'Not specified'}
- Camera Movement: ${cameraSettings.movement || 'Not specified'}  
- Shot Type: ${cameraSettings.shot || 'Not specified'}
Please incorporate these camera specifications into your technical recommendations.`;
    }

    if (lightingSettings && (lightingSettings.mood || lightingSettings.style || lightingSettings.timeOfDay)) {
      systemPrompt += `\n\nLIGHTING SPECIFICATIONS:
- Lighting Mood: ${lightingSettings.mood || 'Not specified'}
- Lighting Style: ${lightingSettings.style || 'Not specified'}
- Time of Day: ${lightingSettings.timeOfDay || 'Not specified'}
Please incorporate these lighting specifications into your style and technical recommendations.`;
    }

    if (enhancedPrompts) {
      systemPrompt += `\n\nENHANCED PROMPTS: This user has premium access. Provide more detailed, technical, and professional-grade prompts with advanced cinematography techniques, specific color science references, and industry-standard terminology.`;
    }

    if (styleReference) {
      systemPrompt += `\n\nStyle reference: ${styleReference}`;
    }

    // Generate the prompt using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Scene idea: ${sceneIdea}` }
        ],
        max_tokens: enhancedPrompts ? 1500 : 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parse the response into structured sections
    const sections = generatedContent.split(/(?:MAIN PROMPT:|TECHNICAL SPECS:|STYLE NOTES:)/i);
    
    const prompt = {
      mainPrompt: sections[1]?.trim() || generatedContent,
      technicalSpecs: sections[2]?.trim() || selectedPlatform.technical,
      styleNotes: sections[3]?.trim() || `${emotion} mood with professional cinematic quality`,
      platform: platform
    };

    // Increment prompt count for all tiers after successful generation
    console.log(`Incrementing prompt count for ${tier} user:`, user.id);
    
    const { data: newCount, error: incrementError } = await supabase
      .rpc('increment_prompt_count', { user_uuid: user.id });

    if (incrementError) {
      console.error('Error incrementing prompt count:', incrementError);
      // Don't fail the request, but log the error
    } else {
      console.log('New prompt count:', newCount);
    }

    // For now, we'll skip saving to database since the prompt_history table doesn't exist yet
    // This prevents database errors while maintaining functionality
    try {
      // await supabase
      //   .from('prompt_history')
      //   .insert({
      //     user_id: user.id,
      //     scene_idea: sceneIdea,
      //     platform: platform,
      //     style: styleReference || '',
      //     emotion: emotion,
      //     generated_prompt: JSON.stringify(prompt)
      //   });
    } catch (dbError) {
      console.error('Error saving to database:', dbError);
      // Continue anyway - don't fail the request if saving fails
    }

    return new Response(JSON.stringify({ prompt }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in cinematic-prompt-generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
