import type { PromptRequest, GeneratedPrompt } from './types.ts';
import { BOT_ID, BOT_API_BASE_URL } from './constants.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function generatePromptWithBot(request: PromptRequest): Promise<GeneratedPrompt> {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // Build the streamlined message with only essential information
  const message = buildStreamlinedMessage(request);

  try {
    // Call the bot API instead of OpenAI directly
    const response = await fetch(`${BOT_API_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
        message: message,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Bot API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.response || data.message || data.text;

    if (!generatedContent) {
      throw new Error('No response from bot API');
    }

    // Parse the response and return in the expected format
    return parseStreamlinedResponse(generatedContent, request);
  } catch (error) {
    console.error('Bot API error:', error);
    throw new Error(`Failed to generate prompt via bot: ${error.message}`);
  }
}

function buildStreamlinedMessage(request: PromptRequest): string {
  const {
    sceneIdea,
    platform,
    emotion,
    styleReference,
    cameraSettings,
    lightingSettings,
    soundSettings,
    dialogSettings,
    sceneContext,
    isMultiScene,
    sceneNumber,
    totalScenes
  } = request;

  let message = `Platform: ${platform.toUpperCase()}\n`;
  message += `Scene: ${sceneIdea}\n`;
  message += `Emotion: ${emotion}\n`;

  // Add camera specifications if provided
  if (cameraSettings && Object.keys(cameraSettings).length > 0) {
    const specs = [];
    if (cameraSettings.angle) specs.push(`angle: ${cameraSettings.angle}`);
    if (cameraSettings.movement) specs.push(`movement: ${cameraSettings.movement}`);
    if (cameraSettings.shot) specs.push(`shot: ${cameraSettings.shot}`);
    if (specs.length > 0) {
      message += `Camera: ${specs.join(', ')}\n`;
    }
  }

  // Add lighting specifications if provided
  if (lightingSettings && Object.keys(lightingSettings).length > 0) {
    const lighting = [];
    if (lightingSettings.mood) lighting.push(`mood: ${lightingSettings.mood}`);
    if (lightingSettings.style) lighting.push(`style: ${lightingSettings.style}`);
    if (lightingSettings.timeOfDay) lighting.push(`time: ${lightingSettings.timeOfDay}`);
    if (lighting.length > 0) {
      message += `Lighting: ${lighting.join(', ')}\n`;
    }
  }

  // Add audio specifications if provided
  if (soundSettings?.hasSound && soundSettings.soundDescription) {
    message += `Audio: ${soundSettings.soundDescription}\n`;
  }

  // Add style reference if provided
  if (styleReference) {
    message += `Style: ${styleReference}\n`;
  }

  // Add continuity information for multi-scene projects
  if (isMultiScene && sceneContext) {
    message += `\nContinuity (Scene ${sceneNumber}/${totalScenes}):\n`;
    message += `Previous scene: ${sceneContext.sceneExcerpt}\n`;
    message += `Characters: ${sceneContext.characters.join(', ')}\n`;
    message += `Location: ${sceneContext.location}\n`;
    message += `Visual style: ${sceneContext.visualStyle}\n`;
    message += `Mood: ${sceneContext.mood}\n`;
    if (sceneContext.keyElements.length > 0) {
      message += `Key elements: ${sceneContext.keyElements.join(', ')}\n`;
    }
  }

  // Add dialog information if present
  if (dialogSettings?.hasDialog && dialogSettings.dialogContent) {
    message += `\nDialog: ${dialogSettings.dialogContent}\n`;
  }

  return message.trim();
}

function parseStreamlinedResponse(generatedContent: string, request: PromptRequest): GeneratedPrompt {
  // The bot should return structured content, but we'll parse it flexibly
  const lines = generatedContent.split('\n').filter(line => line.trim());
  
  let mainPrompt = '';
  let technicalSpecs = '';
  let styleNotes = '';
  let currentSection = 'main';

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Check for section headers
    if (trimmed.toLowerCase().includes('technical') || trimmed.toLowerCase().includes('specs')) {
      currentSection = 'technical';
      continue;
    } else if (trimmed.toLowerCase().includes('style') || trimmed.toLowerCase().includes('notes')) {
      currentSection = 'style';
      continue;
    } else if (trimmed.toLowerCase().includes('main') || trimmed.toLowerCase().includes('prompt')) {
      currentSection = 'main';
      continue;
    }

    // Add content to appropriate section
    if (currentSection === 'main') {
      mainPrompt += (mainPrompt ? ' ' : '') + trimmed;
    } else if (currentSection === 'technical') {
      technicalSpecs += (technicalSpecs ? ' ' : '') + trimmed;
    } else if (currentSection === 'style') {
      styleNotes += (styleNotes ? ' ' : '') + trimmed;
    }
  }

  // If no clear sections found, treat entire content as main prompt
  if (!mainPrompt && !technicalSpecs && !styleNotes) {
    mainPrompt = generatedContent.trim();
  }

  // Generate basic metadata for compatibility
  const metadata = {
    characters: request.sceneContext?.characters || [],
    location: request.sceneContext?.location || 'unspecified',
    timeOfDay: request.lightingSettings?.timeOfDay || 'unspecified',
    mood: request.emotion,
    visualStyle: request.sceneContext?.visualStyle || request.styleReference || 'cinematic',
    keyProps: request.sceneContext?.keyElements || [],
    colorPalette: [],
    cameraWork: request.cameraSettings ? 
      `${request.cameraSettings.shot || ''} ${request.cameraSettings.angle || ''} ${request.cameraSettings.movement || ''}`.trim() : 
      'standard',
    lighting: request.lightingSettings?.style || 'natural',
    storyElements: []
  };

  return {
    mainPrompt: mainPrompt || 'Generated prompt content',
    technicalSpecs: technicalSpecs || `Platform-optimized specifications for ${request.platform}`,
    styleNotes: styleNotes || `${request.emotion} mood with cinematic styling`,
    platform: request.platform,
    metadata
  };
}