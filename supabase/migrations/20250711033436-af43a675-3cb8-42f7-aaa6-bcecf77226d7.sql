-- Update the generated_prompt column comment to indicate it now supports enhanced metadata structure
COMMENT ON COLUMN cinematic_scenes.generated_prompt IS 'Generated prompt data including mainPrompt, technicalSpecs, styleNotes, platform info, and structured metadata for scene continuity';

-- Update the prompt_history generated_prompt column comment as well
COMMENT ON COLUMN prompt_history.generated_prompt IS 'Generated prompt data including mainPrompt, technicalSpecs, styleNotes, platform info, and structured metadata for scene continuity';