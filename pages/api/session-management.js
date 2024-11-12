// pages/api/session-management.js
import supabaseServer from '../../config/supabaseServerConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.body;
  let sessionExpired = false;
  let credits = 0;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  // Check session in the database
  const { data, error } = await supabaseServer
    .from('SessionDB')
    .select('expiry, credits')
    .eq('session_id', sessionId)
    .single();

  if (error || !data || new Date(data.expiry) < new Date()) {
    sessionExpired = true;

    // Delete expired session if needed
    await supabase.from('SessionDB').delete().eq('session_id', sessionId);
    return res.status(200).json({ sessionExpired, credits: 0 });
  } else {
    credits = data.credits;
  }

  // Return session information to the client
  return res.status(200).json({ sessionExpired, credits });
}
