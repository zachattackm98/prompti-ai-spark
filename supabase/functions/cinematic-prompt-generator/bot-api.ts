import type { PromptRequest, GeneratedPrompt } from './types.ts';
import { BOT_ID } from './constants.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function generatePromptWithBot(request: PromptRequest): Promise<GeneratedPrompt> {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('Calling OpenAI Responses API with bot ID:', BOT_ID);
  
  // Build the streamlined message with only essential information
  const message = buildStreamlinedMessage(request);
  console.log('Bot input message:', message.substring(0, 200) + '...');

  try {
    // Call the OpenAI Responses API with correct endpoint and payload structure
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: {
          id: BOT_ID,
          version: 1
        },
        inputs: [
          {
            content: message
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI Responses API error:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText.substring(0, 500)
      });
      throw new Error(`OpenAI Responses API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI Responses API response structure:', Object.keys(data));
    
    // Extract the generated content from the response
    // The response structure may vary, so we'll check multiple possible paths
    let generatedContent = '';
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      generatedContent = data.choices[0].message.content;
    } else if (data.outputs && data.outputs[0]) {
      generatedContent = data.outputs[0].content || data.outputs[0].text;
    } else if (data.content) {
      generatedContent = data.content;
    } else if (data.text) {
      generatedContent = data.text;
    } else if (data.response) {
      generatedContent = data.response;
    }

    if (!generatedContent) {
      console.error('No content found in OpenAI Responses API response:', data);
      throw new Error('OpenAI Responses API returned no usable content');
    }

    console.log('Bot API response received successfully, content length:', generatedContent.length);
    console.log('Response preview:', generatedContent.substring(0, 100) + '...');
    
    // Parse the response and return in the expected format
    return parseStreamlinedResponse(generatedContent, request);
  } catch (error) {
    console.error('OpenAI Responses API error details:', {
      message: error.message,
      stack: error.stack
    });
    throw new Error(`Failed to generate prompt via OpenAI Responses API: ${error.message}`);
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