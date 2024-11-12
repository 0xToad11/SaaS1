import supabaseServer from '../../config/supabaseServerConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, creditAccount } = req.body;

  if (!userId || creditAccount === undefined) {
    return res.status(400).json({ error: 'User ID and current credit account are required' });
  }

  // Update the credit_account in the database
  const { error } = await supabaseServer
    .from('users')
    .update({ credit_account: creditAccount - 1 })
    .eq('id', userId);

  if (error) {
    return res.status(500).json({ error: 'Error decrementing credits' });
  }

  console.log("Decremented credit_account for user:", userId);
  return res.status(200).json({ success: true });
}
