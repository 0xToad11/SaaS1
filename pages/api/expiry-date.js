import { createClient } from '@supabase/supabase-js';

import supabaseServer from '../../config/supabaseServerConfig';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { data: users, error } = await supabaseServer
      .from('users')
      .select('id, stripe_expiry_date')
      .not('subscription', 'eq', 'invalid');

    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Error fetching users' });
    }

    const currentDate = new Date();

    for (const user of users) {
      const expiryDate = new Date(user.stripe_expiry_date);
      if (expiryDate < currentDate) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ subscription: 'invalid' })
          .eq('id', user.id);

        if (updateError) {
          console.error(`Error updating subscription for user ${user.id}:`, updateError);
        } else {
          console.log(`Subscription updated to 'invalid' for user ${user.id}`);
        }
      }
    }

    res.status(200).json({ message: 'Expiry dates checked and updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error checking expiry dates' });
  }
}
