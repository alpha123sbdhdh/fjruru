-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  is_edited BOOLEAN DEFAULT FALSE,
  reply_to_id UUID REFERENCES messages(id)
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read messages
CREATE POLICY "Public messages are viewable by everyone" 
ON messages FOR SELECT 
USING (true);

-- Create policy to allow authenticated users to insert messages
CREATE POLICY "Users can insert their own messages" 
ON messages FOR INSERT 
WITH CHECK (true);

-- Create policy to allow users to update their own messages
CREATE POLICY "Users can update their own messages" 
ON messages FOR UPDATE
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own messages
CREATE POLICY "Users can delete their own messages" 
ON messages FOR DELETE
USING (auth.uid() = user_id);

-- Create storage bucket for media uploads if needed
INSERT INTO storage.buckets (id, name) VALUES ('media', 'media');
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'media' );
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'media' );
