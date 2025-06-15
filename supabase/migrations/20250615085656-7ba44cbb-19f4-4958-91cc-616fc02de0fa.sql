
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prompts table to store user's original inputs
CREATE TABLE public.prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  framework TEXT NOT NULL,
  model TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transformations table to store AI-generated results
CREATE TABLE public.transformations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID REFERENCES public.prompts ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  transformed_content TEXT NOT NULL,
  provider TEXT NOT NULL,
  model_used TEXT NOT NULL,
  processing_time INTEGER, -- milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_api_keys table to securely store API keys
CREATE TABLE public.user_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google')),
  encrypted_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Prompts policies
CREATE POLICY "Users can view their own prompts" ON public.prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prompts" ON public.prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts" ON public.prompts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompts" ON public.prompts
  FOR DELETE USING (auth.uid() = user_id);

-- Transformations policies
CREATE POLICY "Users can view their own transformations" ON public.transformations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transformations" ON public.transformations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- API keys policies
CREATE POLICY "Users can view their own API keys" ON public.user_api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own API keys" ON public.user_api_keys
  FOR ALL USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_user_api_keys_updated_at
  BEFORE UPDATE ON public.user_api_keys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
