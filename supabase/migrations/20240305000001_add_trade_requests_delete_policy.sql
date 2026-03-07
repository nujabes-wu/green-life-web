-- Add delete policy for trade requests
create policy "Users can delete their own trade requests" on trade_requests for delete using (
  auth.uid() = buyer_id or auth.uid() = seller_id
);
