-- Make sure all questions are active
UPDATE questions
SET is_active = true
WHERE is_active IS NULL;
