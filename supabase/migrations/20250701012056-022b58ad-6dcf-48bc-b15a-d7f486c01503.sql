
-- Create a table to store friend relationships
CREATE TABLE public.friendships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(requester_id, addressee_id)
);

-- Enable Row Level Security
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Create policies for friendships table
CREATE POLICY "Users can view their own friendships" 
  ON public.friendships 
  FOR SELECT 
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can create friend requests" 
  ON public.friendships 
  FOR INSERT 
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendships they're involved in" 
  ON public.friendships 
  FOR UPDATE 
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Create a view to get user's friends with profile info
CREATE OR REPLACE VIEW public.user_friends AS
SELECT 
  f.id as friendship_id,
  f.status,
  f.created_at,
  CASE 
    WHEN f.requester_id = auth.uid() THEN f.addressee_id
    ELSE f.requester_id
  END as friend_id,
  CASE 
    WHEN f.requester_id = auth.uid() THEN addressee.full_name
    ELSE requester.full_name
  END as friend_name,
  CASE 
    WHEN f.requester_id = auth.uid() THEN addressee.email
    ELSE requester.email
  END as friend_email,
  f.requester_id = auth.uid() as is_requester
FROM public.friendships f
JOIN public.profiles requester ON f.requester_id = requester.id
JOIN public.profiles addressee ON f.addressee_id = addressee.id
WHERE (f.requester_id = auth.uid() OR f.addressee_id = auth.uid());

-- Create RLS policy for the view
ALTER VIEW public.user_friends SET (security_invoker = on);
