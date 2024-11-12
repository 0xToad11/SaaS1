// pages/api/add-session.js
//import supabase from '../../config/supabaseConfig'; // Your server-side Supabase client setup
import supabaseServer from '../../config/supabaseServerConfig'; // Use the server-side Supabase client

export default async function handler(req, res) {
  const { sessionId, credits } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  // Only allow setting 2 credits server-side to prevent tampering
  const { data, error } = await supabaseServer.from('SessionDB').insert([
    {
      session_id: sessionId,
      credits: 2,
      expiry: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // 24 hours from now
    }
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ data });
}
