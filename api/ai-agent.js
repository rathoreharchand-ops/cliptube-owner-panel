export default async function handler(req, res) {
  // CORS
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
    let message = '';
    let action = '';

    // Logic - तुम्हारा AI Brain
        // LIVE Check - Hindi + English दोनों!
    if (lower.includes('live') || lower.includes('लाइव') || lower.includes('लाइव बटन')) {
      if (lower.includes('हटा') || lower.includes('बंद') || lower.includes('remove') || lower.includes('off') || lower.includes('हट')) {
        updatedFeatures.live = false;
        message = 'हो गया मालिक! 🔴 LIVE बटन हटा दिया / OFF कर दिया! ✅';
        action = 'live_off';
      } else {
        updatedFeatures.live = true;
        message = 'हो गया मालिक! 🔴 LIVE बटन जोड़ दिया / ON कर दिया! सबके App में LIVE आ गया! ✅\n\nअब तुम्हारा Main ClipTube App खोलो - वहाँ LIVE बटन दिखेगा!';
        action = 'live_on';
      }
    } else if (lower.includes('messenger') || lower.includes('मैसेंजर') || lower.includes('चैट') || lower.includes('मैसेंजर')) {
      if (lower.includes('हटा') || lower.includes('बंद') || lower.includes('remove') || lower.includes('off')) {
        updatedFeatures.live = false;
        message = 'हो गया मालिक! 🔴 LIVE बटन हटा दिया / OFF कर दिया! ✅';
        action = 'live_off';
      } else {
        updatedFeatures.live = true;
        message = 'हो गया मालिक! 🔴 LIVE बटन जोड़ दिया / ON कर दिया! सबके App में LIVE आ गया! ✅';
        action = 'live_on';
      }
    } else if (lower.includes('messenger') || lower.includes('मैसेंजर') || lower.includes('चैट')) {
      updatedFeatures.messenger = !lower.includes('हटा') && !lower.includes('बंद');
      message = updatedFeatures.messenger ? 'हो गया मालिक! 💬 Messenger जोड़ दिया! ✅' : 'हो गया मालिक! Messenger हटा दिया! ✅';
      action = 'messenger';
    } else if (lower.includes('download')) {
      updatedFeatures.download = !lower.includes('हटा') && !lower.includes('बंद');
      message = updatedFeatures.download ? 'हो गया मालिक! ⬇️ Download बटन जोड़ दिया! ✅' : 'हो गया मालिक! Download हटा दिया! ✅';
      action = 'download';
    } else if (lower.includes('video') || lower.includes('call')) {
      updatedFeatures.videoCall = !lower.includes('हटा') && !lower.includes('बंद');
      message = updatedFeatures.videoCall ? 'हो गया मालिक! 📹 Video Call जोड़ दिया! ✅' : 'हो गया मालिक! Video Call हटा दिया! ✅';
      action = 'videoCall';
    } else {
      message = `समझ गया मालिक! तुमने कहा: "${command}"\n\nमैं इसे समझ गया हूँ! अभी मैं इन Features को Control कर सकता हूँ: LIVE, Messenger, Download, VideoCall\n\nजैसे बोलो - "एक LIVE बटन जोड़ दे"`;
    }

    // --- Supabase में Save करने की कोशिश (अगर Keys हैं तो) ---
    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
      if (supabaseUrl && supabaseKey) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        // app_config table में save करो
        await supabase.from('app_config').upsert({ id: 1, features: updatedFeatures, last_command: command, last_action: action, updated_at: new Date().toISOString() }, { onConflict: 'id' });
      }
    } catch (dbErr) {
      console.log('Supabase skip:', dbErr.message);
      // DB fail भी हो तो App को चलने दो
    }

    return res.status(200).json({
      success: true,
      message,
      updatedFeatures,
      action
    });

  } catch (err) {
    console.error('AI Agent Error:', err);
    return res.status(200).json({ success: false, error: err.message });
  }
}