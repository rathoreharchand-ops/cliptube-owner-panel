import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({error: 'Only POST'});

  const { command } = req.body; // जैसे "एक लाइव बटन जोड़ दो"

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Gemini से समझो यूजर क्या चाहता है
  const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.VITE_GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `तुम ClipTube के AI हो। यूजर ने कहा: "${command}". इसका feature_name (जैसे live_button) और config JSON में निकालो। सिर्फ JSON देना: {"feature_name": "...", "config": {"label": "...", "message": "..."}}` }]
      }]
    })
  });

  const geminiData = await geminiRes.json();
  let text = geminiData.candidates[0].content.parts[0].text;
  text = text.replace(/```json|```/g, '').trim();
  const feature = JSON.parse(text);

  // Supabase में डाल दो - सबके फोन में चला जाएगा!
  const { data, error } = await supabase
   .from('app_features')
   .upsert({
      feature_name: feature.feature_name,
      enabled: true,
      config: feature.config
    }, { onConflict: 'feature_name' });

  if (error) return res.status(500).json({error: error.message});

  return res.status(200).json({
    success: true,
    message: `हो गया मालिक! ${feature.feature_name} सबके फोन में जोड़ दिया!`,
    feature
  });
}