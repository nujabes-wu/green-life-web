-- Add delete policies for chat tables

-- Allow users to delete their own chats
create policy "Users can delete their own chats" on chats for delete using (
  auth.uid() = buyer_id or auth.uid() = seller_id
);

-- Allow users to delete their own messages
create policy "Users can delete their own messages" on messages for delete using (
  auth.uid() = sender_id
);
