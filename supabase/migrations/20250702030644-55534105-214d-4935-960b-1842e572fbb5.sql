
-- Create tables for daily tracking of food and exercise logs
CREATE TABLE public.daily_food_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
  food_name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  serving TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.daily_exercise_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  exercise_name TEXT NOT NULL,
  exercise_type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  calories INTEGER NOT NULL,
  intensity TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for food logs
ALTER TABLE public.daily_food_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own food logs" 
  ON public.daily_food_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own food logs" 
  ON public.daily_food_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food logs" 
  ON public.daily_food_logs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for exercise logs
ALTER TABLE public.daily_exercise_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exercise logs" 
  ON public.daily_exercise_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercise logs" 
  ON public.daily_exercise_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise logs" 
  ON public.daily_exercise_logs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_daily_food_logs_user_date ON public.daily_food_logs(user_id, date);
CREATE INDEX idx_daily_exercise_logs_user_date ON public.daily_exercise_logs(user_id, date);
