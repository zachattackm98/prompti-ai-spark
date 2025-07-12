# Cinematic Prompt Generator - Dual Approach System

This function now supports two approaches for generating prompts:

## 1. Streamlined Bot Approach (Default)
- Uses the specialized Veo3 expert bot (ID: `pmpt_6871afe3e2488195b4f42067f15f9a200933641e7fae9214`)
- Sends only essential information: scene description, platform, camera specs, lighting, audio, style reference, continuity data
- More efficient and optimized for prompt generation
- Automatically falls back to legacy approach if it fails

## 2. Legacy OpenAI Approach
- Uses the original detailed system prompt and complex prompt building logic
- Available as fallback or for explicit use

## Configuration

### Switching Approaches
Set the environment variable `USE_LEGACY_APPROACH=true` in Supabase Edge Functions secrets to use the legacy approach.

### Files Structure
- `openai.ts` - Main entry point with approach selection logic
- `bot-api.ts` - New streamlined bot-based approach
- `openai-legacy.ts` - Original OpenAI approach (renamed)
- `prompt-builder-legacy.ts` - Original prompt building logic (renamed)

### Risk Mitigation
- Automatic fallback: If bot approach fails, automatically falls back to legacy
- Environment toggle: Instant switching via `USE_LEGACY_APPROACH` environment variable
- Preserved functionality: All existing logic preserved with "_legacy" suffix
- Response compatibility: Both approaches return the same `GeneratedPrompt` structure

### Bot API Integration
The bot approach uses:
- Bot ID: `pmpt_6871afe3e2488195b4f42067f15f9a200933641e7fae9214`
- API: `https://api.chatbotapi.ai/v1/chat/completions`
- Authentication: Uses the same OpenAI API key
- Streamlined message format with only essential information

### Monitoring
Check the function logs to see which approach is being used:
- "Using streamlined bot approach" - New approach active
- "Using legacy OpenAI approach" - Legacy approach active
- "Bot approach failed, falling back to legacy" - Automatic fallback occurred