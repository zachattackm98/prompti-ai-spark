
import type { PromptRequest, GeneratedPrompt } from './types.ts';
import { buildSystemPrompt, parsePromptResponse } from './prompt-builder.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function generatePromptWithOpenAI(request: PromptRequest): Promise<GeneratedPrompt> {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = buildSystemPrompt(request);

  // Build user prompt with enhanced context information
  let userPrompt = `Scene idea: ${request.sceneIdea}`;

  // Add context information for multi-scene projects
  if (request.isMultiScene && request.previousScenePrompts && request.previousScenePrompts.length > 0) {
    userPrompt += `\n\nThis is Scene ${request.sceneNumber} of ${request.totalScenes}. Please ensure this scene continues naturally from the previous scenes while maintaining character and environmental consistency.`;
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
        { role: 'user', content: userPrompt }
      ],
      max_tokens: request.enhancedPrompts ? 1500 : 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const generatedContent = data.choices[0].message.content;

  return parsePromptResponse(
    generatedContent, 
    request.platform, 
    request.sceneNumber, 
    request.totalScenes
  );
}
