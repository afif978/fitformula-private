
-- Add missing columns to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN age integer,
ADD COLUMN height integer,
ADD COLUMN current_weight numeric(5,2),
ADD COLUMN goal_weight numeric(5,2),
ADD COLUMN activity_level text,
ADD COLUMN fitness_goal text;
