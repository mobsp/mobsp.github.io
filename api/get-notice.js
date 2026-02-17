import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // 這些 URL 和 KEY 之後要設定在 Vercel 的 Environment Variables 裡
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    try {
        const { data, error } = await supabase
            .from('notices')
            .select('type, message');

        if (error) throw error;

        // 在雲端直接做好隨機挑選
        const randomItem = data[Math.floor(Math.random() * data.length)];
        
        // 設定快取，讓 API 跑更快 (10秒內重複訪問直接給緩存)
        res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');
        res.status(200).json(randomItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
