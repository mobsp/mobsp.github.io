import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_ROLE_KEY // 藏在後台的金鑰
  );

  const { data, error } = await supabase
    .from('notices')
    .select('type, message');

  if (error) return res.status(500).json({ error: error.message });

  // 在伺服器端就把隨機挑選做完，減輕手機負擔
  const randomItem = data[Math.floor(Math.random() * data.length)];
  
  // 只回傳這一個乾淨的結果
  res.status(200).json(randomItem);
}
