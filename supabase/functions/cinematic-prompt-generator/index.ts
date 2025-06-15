
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sceneIdea, platform, emotion, styleReference } = await req.json();

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

    // Platform-specific system prompts
    const platformPrompts = {
      'runway': {
        system: "You are an expert in Runway ML video generation. Create production-quality prompts optimized for Runway's cinematic capabilities, focusing on camera movements, lighting, and professional cinematography techniques.",
        technical: "4K resolution, 24fps, cinematic aspect ratio 16:9, professional color grading, smooth camera movements"
      },
      'pika': {
        system: "You are an expert in Pika Labs video generation. Create engaging prompts that leverage Pika's strengths in creative storytelling and dynamic visual effects.",
        technical: "HD quality, creative transitions, dynamic camera work, enhanced visual effects, storytelling focus"
      },
      'stable-video': {
        system: "You are an expert in Stable Video Diffusion. Create detailed prompts that work well with stable diffusion video generation, emphasizing visual consistency and artistic style.",
        technical: "High-quality generation, consistent visual style, artistic rendering, stable motion flow"
      },
      'luma': {
        system: "You are an expert in Luma AI video generation. Create professional prompts optimized for Luma's advanced 3D understanding and realistic video synthesis.",
        technical: "Professional quality, realistic 3D depth, advanced lighting simulation, photorealistic rendering"
      }
    };

    const selectedPlatform = platformPrompts[platform as keyof typeof platformPrompts] || platformPrompts.runway;

    const systemPrompt = `${selectedPlatform.system}

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
${styleReference ? `Style reference: ${styleReference}` : ''}`;

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
        max_tokens: 1000,
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

    // Save to database
    try {
      await supabase
        .from('prompt_history')
        .insert({
          user_id: user.id,
          scene_idea: sceneIdea,
          platform: platform,
          style: styleReference || '',
          emotion: emotion,
          generated_prompt: JSON.stringify(prompt)
        });
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
