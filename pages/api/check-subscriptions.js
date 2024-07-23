// pages/api/check-subscriptions.js

import supabase from "@/config/supabaseConfig";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get current time
    const now = new Date().toISOString();

    // Fetch users where the expiry_date is less than the current time
    const { data: users, error } = await supabase
      .from('users')
      .select('id')
      .lte('expiry_date', now)
      .eq('subscription', 'active'); // Assuming you only want to update active subscriptions

    if (error) throw error;

    // Update users whose subscription has expired
    if (users.length > 0) {
      const userIds = users.map(user => user.id);
      const { error: updateError } = await supabase
        .from('users')
        .update({ subscription: 'invalid' })
        .in('id', userIds);

      if (updateError) throw updateError;
    }

    res.status(200).json({ message: 'Subscription statuses updated successfully' });
  } catch (error) {
    console.error('Error updating subscriptions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
