// pages/api/decrement-credits.js
import supabaseServer from '../../config/supabaseServerConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId, credits } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  // Update the credits in the database
  const { error } = await supabaseServer
    .from('SessionDB')
    .update({ credits: credits - 1 })
    .eq('session_id', sessionId);

  if (error) {
    return res.status(500).json({ error: 'Error decrementing credits' });
  }

  console.log("Decremented credits for session:", sessionId);
  return res.status(200).json({ success: true });
}
