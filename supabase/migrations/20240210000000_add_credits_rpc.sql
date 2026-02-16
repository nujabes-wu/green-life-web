-- Create a secure function to add credits
create or replace function add_credits(amount integer, description text)
returns void as $$
declare
  user_id uuid;
begin
  -- Get the ID of the currently authenticated user
  user_id := auth.uid();
  
  if user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Update credits
  update profiles 
  set credits = coalesce(credits, 0) + amount 
  where id = user_id;

  -- Record transaction
  insert into credit_transactions (user_id, amount, type, description)
  values (user_id, amount, 'earn', description);
end;
$$ language plpgsql security definer;
