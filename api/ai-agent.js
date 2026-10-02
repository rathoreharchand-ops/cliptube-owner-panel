export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  try {
    const { command, features } = req.body;
    if (!command) return res.status(400).json({ success: false, error: 'Command missing' });
    const lower = command.toLowerCase();
    let updatedFeatures = { ...features };
    let message = ''; let action = '';

    if (lower.includes('live') || lower.includes('लाइव')) {
      if (lower.includes('हटा') || lower.includes('बंद') || lower.includes('हट') || lower.includes('off') || lower.includes('remove')) {
        updatedFeatures.live = false;
        message = 'हो गया मालिक! 🔴 LIVE बटन हटा दिया! OFF ✅';
        action = 'live_off';
      } else {
        updatedFeatures.live = true;
        message = 'हो गया मालिक! 🔴 LIVE बटन जोड़ दिया! ON ✅\n\nअब तुम्हारा Main ClipTube App में LIVE बटन दिखेगा!';
        action = 'live_on';
      }
    } else if (lower.includes('messenger') || lower.includes('मैसेंजर')) {
      updatedFeatures.messenger = !lower.includes('हटा') && !lower.includes('बंद') && !lower.includes('हट');
      message = updatedFeatures.messenger ? 'हो गया मालिक! 💬 Messenger जोड़ दिया! ✅' : 'हो गया मालिक! Messenger हटा दिया! ✅';
    } else if (lower.includes('download') || lower.includes('डाउनलोड')) {
      updatedFeatures.download = !lower.includes('हटा') && !lower.includes('बंद');
      message = updatedFeatures.download ? 'हो गया मालिक! ⬇️ Download जोड़ दिया! ✅' : 'हो गया मालिक! Download हटा दिया! ✅';
    } else if (lower.includes('video') || lower.includes('call') || lower.includes('वीडियो')) {
      updatedFeatures.videoCall = !lower.includes('हटा') && !lower.includes('बंद');
      message = updatedFeatures.videoCall ? 'हो गया मालिक! 📹 Video Call जोड़ दिया! ✅' : 'हो गया मालिक! Video Call हटा दिया! ✅';
    } else {
      message = `समझ गया मालिक! तुमने कहा: "${command}"\n\nबोलो - "LIVE जोड़ दे" / "लाइव जोड़ दे" / "Download जोड़ दे"`;
    }

    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
      if (supabaseUrl && supabaseKey) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('app_config').upsert({ id: 1, features: updatedFeatures, last_command: command, last_action: action, updated_at: new Date().toISOString() }, { onConflict: 'id' });
      }
    } catch (dbErr) { console.log('DB skip', dbErr.message); }

    return res.status(200).json({ success: true, message, updatedFeatures, action });
  } catch (err) {
    return res.status(200).json({ success: false, error: err.message });
  }
}