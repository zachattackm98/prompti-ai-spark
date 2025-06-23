
import type { PromptRequest } from './types.ts';

export function buildInstantModePrompt(request: PromptRequest): string {
  const { sceneIdea, platform, emotion } = request;
  
  // Auto-enhance the scene description for Instant mode
  const enhancedSceneDescription = enhanceSceneDescriptionForInstant(sceneIdea, platform, emotion);
  
  return `You are an expert AI video prompt generator optimized for ${platform.toUpperCase()}. Transform this scene idea into a production-ready prompt.

INSTANT MODE SPECIFICATIONS:
- This is Instant Mode: prioritize speed and smart defaults
- Auto-detected platform: ${platform.toUpperCase()}
- Auto-selected emotion/mood: ${emotion}
- Focus on creating immediate, high-impact prompts
- Use smart defaults for technical specifications
- Optimize for the detected platform's strengths

SCENE TO TRANSFORM:
${enhancedSceneDescription}

PLATFORM OPTIMIZATION (${platform.toUpperCase()}):
${getPlatformOptimizationPrompt(platform)}

INSTANT MODE REQUIREMENTS:
1. Create a concise but detailed main prompt (150-200 words)
2. Include platform-optimized technical specifications
3. Add style notes that enhance the auto-detected emotion: ${emotion}
4. Use professional cinematography terminology
5. Include appropriate camera movements and lighting for the scene
6. Ensure the prompt is immediately usable on ${platform}

OUTPUT FORMAT:
MAIN PROMPT: [Detailed cinematic description optimized for ${platform}]

TECHNICAL SPECS: [Platform-specific technical parameters]

STYLE NOTES: [Visual style and mood direction for ${emotion} emotion]`;
}

export function buildAnimalVlogModePrompt(request: PromptRequest): string {
  const { 
    sceneIdea, 
    platform, 
    emotion, 
    animalType, 
    selectedVibe, 
    hasDialogue, 
    dialogueContent 
  } = request;
  
  // Enhanced scene description for animal vlog content
  const enhancedAnimalScene = enhanceSceneDescriptionForAnimalVlog(
    sceneIdea, 
    animalType!, 
    selectedVibe!, 
    hasDialogue, 
    dialogueContent
  );
  
  return `You are an expert AI video prompt generator specializing in animal content and vlogging. Create engaging prompts optimized for animal behavior and vlog-style content.

ANIMAL VLOG MODE SPECIFICATIONS:
- Animal Type: ${animalType}
- Vibe: ${selectedVibe}
- Platform: ${platform.toUpperCase()}
- Emotion/Mood: ${emotion}
- Has Dialogue: ${hasDialogue ? 'Yes' : 'No'}
${hasDialogue && dialogueContent ? `- Dialogue Content: "${dialogueContent}"` : ''}

ENHANCED SCENE DESCRIPTION:
${enhancedAnimalScene}

ANIMAL VLOG REQUIREMENTS:
1. Focus on authentic animal behavior and natural movements
2. Incorporate vlog-style cinematography (handheld, personal, engaging)
3. Emphasize the ${selectedVibe} vibe throughout the scene
4. Use camera angles that capture ${animalType} characteristics effectively
5. Include environmental elements that enhance animal comfort and natural behavior
6. Optimize for ${platform}'s strengths while maintaining vlog authenticity
${hasDialogue ? '7. Seamlessly integrate dialogue/narration into the animal scene' : ''}

ANIMAL-SPECIFIC CINEMATOGRAPHY GUIDELINES:
${getAnimalCinematographyGuidelines(animalType!)}

VIBE-SPECIFIC DIRECTION (${selectedVibe}):
${getVibeSpecificDirection(selectedVibe!)}

OUTPUT FORMAT:
MAIN PROMPT: [Detailed animal vlog scene optimized for ${animalType} with ${selectedVibe} vibe]

TECHNICAL SPECS: [Platform and animal-behavior optimized technical parameters]

STYLE NOTES: [Vlog-style direction emphasizing ${selectedVibe} mood and ${animalType} characteristics]`;
}

function enhanceSceneDescriptionForInstant(sceneIdea: string, platform: string, emotion: string): string {
  const platformEnhancement = getPlatformEnhancement(platform);
  const emotionEnhancement = getEmotionEnhancement(emotion);
  
  return `${sceneIdea}

[Auto-enhanced for ${platform}]: ${platformEnhancement}
[Emotion enhancement for ${emotion}]: ${emotionEnhancement}`;
}

function enhanceSceneDescriptionForAnimalVlog(
  sceneIdea: string, 
  animalType: string, 
  vibe: string, 
  hasDialogue: boolean, 
  dialogueContent?: string
): string {
  const animalBehaviorEnhancement = getAnimalBehaviorEnhancement(animalType, vibe);
  const vlogStyleEnhancement = getVlogStyleEnhancement(vibe);
  const dialogueIntegration = hasDialogue && dialogueContent ? 
    `\n[Dialogue integration]: Seamlessly incorporate "${dialogueContent}" into the scene through ${getDialogueDeliveryMethod(animalType)}` : '';
  
  return `${sceneIdea}

[Animal behavior enhancement]: ${animalBehaviorEnhancement}
[Vlog style enhancement]: ${vlogStyleEnhancement}${dialogueIntegration}`;
}

function getPlatformOptimizationPrompt(platform: string): string {
  switch (platform) {
    case 'veo3':
      return 'Emphasize cinematic realism, professional lighting setups, smooth camera movements, and photorealistic detail. Use film industry terminology.';
    case 'sora':
      return 'Focus on natural physics, realistic lighting, authentic environmental details, and lifelike movements. Emphasize documentary-style realism.';
    case 'runway':
      return 'Leverage artistic rendering capabilities, creative visual effects, stylized color grading, and painterly aesthetics. Use artistic terminology.';
    case 'pika':
      return 'Create dynamic, engaging content optimized for social media. Focus on eye-catching movements, viral potential, and short-form appeal.';
    default:
      return 'Use professional cinematography standards with attention to visual quality and engagement.';
  }
}

function getPlatformEnhancement(platform: string): string {
  switch (platform) {
    case 'veo3':
      return 'Enhanced with cinematic camera work, professional lighting design, and film-quality production values';
    case 'sora':
      return 'Enhanced with realistic physics simulation, natural lighting conditions, and authentic environmental details';
    case 'runway':
      return 'Enhanced with artistic visual effects, creative color palettes, and stylized cinematographic techniques';
    case 'pika':
      return 'Enhanced with dynamic movements, social media optimization, and engaging visual hooks';
    default:
      return 'Enhanced with professional video production techniques';
  }
}

function getEmotionEnhancement(emotion: string): string {
  const emotionMap: Record<string, string> = {
    'dramatic': 'Intensified with high contrast lighting, dynamic camera angles, and powerful visual tension',
    'mysterious': 'Enhanced with atmospheric shadows, subtle lighting cues, and enigmatic visual elements',
    'uplifting': 'Brightened with warm lighting, ascending camera movements, and positive visual energy',
    'melancholic': 'Softened with gentle lighting, slower pacing, and contemplative visual mood',
    'intense': 'Amplified with rapid movements, sharp contrasts, and high-energy cinematography',
    'serene': 'Calmed with smooth transitions, natural lighting, and peaceful visual flow',
    'suspenseful': 'Heightened with strategic shadows, tension-building camera work, and anticipatory elements',
    'romantic': 'Warmed with soft lighting, intimate framing, and tender visual aesthetics',
    'epic': 'Expanded with grand scale, sweeping movements, and majestic visual scope',
    'intimate': 'Focused with close framing, gentle lighting, and personal visual connection'
  };
  
  return emotionMap[emotion.toLowerCase()] || 'Enhanced with mood-appropriate visual styling';
}

function getAnimalBehaviorEnhancement(animalType: string, vibe: string): string {
  const animalBehaviors: Record<string, string> = {
    'cat': 'Natural feline movements, curious exploration, graceful agility, and independent behavior patterns',
    'dog': 'Enthusiastic canine energy, loyal interaction, playful movements, and expressive facial responses',
    'bird': 'Aerial agility, perching behaviors, wing movements, and natural chirping or singing patterns',
    'rabbit': 'Quick hopping movements, alert ear positioning, gentle grazing behaviors, and cautious exploration',
    'horse': 'Majestic galloping, powerful stance, mane flowing in wind, and noble presence',
    'elephant': 'Gentle giant movements, trunk expressions, protective family behaviors, and wise demeanor'
  };
  
  const baseAnimalBehavior = animalBehaviors[animalType.toLowerCase()] || 'Natural animal movements and authentic behavioral patterns';
  
  const vibeModification = getVibeBehaviorModification(vibe);
  
  return `${baseAnimalBehavior}, enhanced with ${vibeModification}`;
}

function getVibeBehaviorModification(vibe: string): string {
  const vibeModifications: Record<string, string> = {
    'playful': 'increased energy, bouncy movements, and joyful expressions',
    'cute': 'endearing poses, head tilts, and adorable mannerisms',
    'funny': 'comedic timing, unexpected behaviors, and amusing reactions',
    'adventurous': 'bold exploration, confident movements, and discovery-focused actions',
    'calm': 'relaxed postures, slow movements, and peaceful demeanor',
    'energetic': 'high-speed actions, dynamic movements, and vigorous activity',
    'mischievous': 'sneaky behaviors, playful trouble-making, and cheeky expressions',
    'sleepy': 'drowsy movements, yawning, and cozy positioning',
    'curious': 'investigative behaviors, head movements, and attentive focus',
    'happy': 'upbeat movements, positive energy, and joyful expressions'
  };
  
  return vibeModifications[vibe.toLowerCase()] || 'mood-appropriate behavioral adjustments';
}

function getVlogStyleEnhancement(vibe: string): string {
  return `Vlog-style cinematography with handheld camera feel, personal perspective, authentic moments, and ${vibe} energy that connects with viewers`;
}

function getDialogueDeliveryMethod(animalType: string): string {
  const deliveryMethods: Record<string, string> = {
    'cat': 'off-camera narration while focusing on cat reactions and expressions',
    'dog': 'enthusiastic voiceover matching the dog\'s energy and responses',
    'bird': 'gentle narration complementing natural bird sounds and movements',
    'rabbit': 'soft spoken commentary highlighting rabbit\'s gentle nature',
    'horse': 'respectful narration capturing the horse\'s majestic presence',
    'elephant': 'wise, contemplative voiceover reflecting the elephant\'s intelligence'
  };
  
  return deliveryMethods[animalType.toLowerCase()] || 'appropriate voiceover technique for the animal\'s characteristics';
}

function getAnimalCinematographyGuidelines(animalType: string): string {
  const guidelines: Record<string, string> = {
    'cat': '- Use low angles to capture feline grace\n- Focus on eyes and facial expressions\n- Capture vertical movements and climbing\n- Show paw details and grooming behaviors',
    'dog': '- Eye-level shots for connection\n- Capture tail wagging and body language\n- Show running and playing movements\n- Focus on loyal, expressive eyes',
    'bird': '- Capture flight patterns and wing movements\n- Focus on perching and landing\n- Show beak movements and head turns\n- Highlight feather details and colors',
    'rabbit': '- Low camera for ground-level perspective\n- Capture hopping movements\n- Focus on ear movements and alertness\n- Show gentle grazing and exploration',
    'horse': '- Wide shots for full body majesty\n- Capture galloping and movement\n- Focus on mane and tail flow\n- Show powerful leg movements',
    'elephant': '- Wide shots for scale and presence\n- Capture trunk movements and expressions\n- Show gentle, deliberate movements\n- Focus on intelligent eyes and interactions'
  };
  
  return guidelines[animalType.toLowerCase()] || '- Capture natural animal movements\n- Focus on characteristic behaviors\n- Show environmental interaction\n- Highlight unique physical features';
}

function getVibeSpecificDirection(vibe: string): string {
  const directions: Record<string, string> = {
    'playful': 'Use dynamic camera movements, bright lighting, and energetic pacing to match playful energy',
    'cute': 'Employ soft lighting, gentle movements, and close-ups that emphasize adorable features',
    'funny': 'Time camera movements for comedic effect, use unexpected angles, and capture amusing moments',
    'adventurous': 'Utilize wide shots, dynamic movements, and environmental context for exploration feel',
    'calm': 'Apply smooth camera movements, natural lighting, and peaceful pacing for relaxation',
    'energetic': 'Implement fast cuts, dynamic angles, and high-energy movements matching the activity',
    'mischievous': 'Use sneaky camera angles, playful movements, and lighting that hints at trouble',
    'sleepy': 'Employ slow movements, warm lighting, and cozy framing for restful atmosphere',
    'curious': 'Focus on discovery moments, investigative angles, and lighting that highlights exploration',
    'happy': 'Use bright, warm lighting, upbeat movements, and positive visual energy throughout'
  };
  
  return directions[vibe.toLowerCase()] || 'Apply mood-appropriate cinematography that enhances the intended vibe';
}
