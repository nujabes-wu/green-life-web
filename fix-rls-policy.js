const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixRLSPolicy() {
  try {
    // 直接执行SQL命令添加RLS策略
    const { error } = await supabase
      .rpc('exec_sql', {
        sql: `
          create policy "Users can insert order items for their orders" on order_items for insert with check (
            exists (
              select 1 from user_orders where user_orders.id = order_items.order_id and user_orders.user_id = auth.uid()
            )
          );
        `
      });

    if (error) {
      console.error('Error adding RLS policy:', error);
    } else {
      console.log('RLS policy added successfully!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

fixRLSPolicy();
