-- Create recommendations table
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price TEXT,
    tag TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access
CREATE POLICY "Allow public read access" ON public.recommendations
    FOR SELECT USING (true);

-- Allow insert/update/delete for authenticated users (or service role)
-- For simplicity in this demo, we'll allow authenticated users to do everything, 
-- but in production you might want to restrict this to admins.
CREATE POLICY "Allow authenticated full access" ON public.recommendations
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Insert initial data
INSERT INTO public.recommendations (title, description, image_url, price, tag, color) VALUES
(
    '节能 LED 灯泡',
    '比传统白炽灯节能 80%，使用寿命长达 15,000 小时。',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=energy%20saving%20LED%20bulb%20with%20green%20eco%20design%2C%20product%20photography%2C%20white%20background&image_size=landscape_4_3',
    '¥29.9',
    '节能',
    'yellow'
),
(
    '竹纤维纸巾',
    '100% 竹浆制造，生长周期短，更环保的可持续选择。',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bamboo%20fiber%20tissue%20paper%20packaging%2C%20eco%20friendly%2C%20product%20photography%2C%20white%20background&image_size=landscape_4_3',
    '¥19.9',
    '可再生',
    'green'
),
(
    '可降解垃圾袋',
    '玉米淀粉基材，在自然环境中可完全降解，减少污染。',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=biodegradable%20trash%20bags%20corn%20starch%20material%2C%20green%20packaging%2C%20product%20photography%2C%20white%20background&image_size=landscape_4_3',
    '¥15.0',
    '可降解',
    'orange'
),
(
    '太阳能充电宝',
    '利用太阳能充电，户外旅行必备，清洁能源随身带。',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=solar%20power%20bank%20portable%20charger%2C%20sleek%20design%2C%20product%20photography%2C%20white%20background&image_size=landscape_4_3',
    '¥199.0',
    '清洁能源',
    'blue'
),
(
    '太阳能庭院灯',
    '利用太阳能充电，自动开关，为庭院提供绿色照明。',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=solar%20garden%20lights%20modern%20design%2C%20product%20photography%2C%20white%20background&image_size=landscape_4_3',
    '¥129.0',
    '清洁能源',
    'blue'
),
(
    '智能插座',
    '远程控制家电开关，监测用电情况，帮助减少不必要的能源消耗。',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=smart%20plug%20wifi%20socket%2C%20modern%20white%20design%2C%20product%20photography%2C%20white%20background&image_size=landscape_4_3',
    '¥89.0',
    '节能',
    'yellow'
);
