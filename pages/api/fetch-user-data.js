// pages/api/fetch-user-data.js
import supabaseServer from '../../config/supabaseServerConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Query the database for the user's information
  const { data, error } = await supabaseServer
    .from('users')
    .select('id, email, first_name, last_name, subscription, stripe_sub_type, expiry_date')
    .eq('id', userId)
    .single();

  if (error) {
    return res.status(500).json({ error: 'Error fetching user data' });
  }

  return res.status(200).json(data);
}
