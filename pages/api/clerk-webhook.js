import { buffer } from 'micro';
import supabaseServer from '../../config/supabaseServerConfig';

export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  const handler = async (req, res) => {
    if (req.method === 'POST') {
      try {
        const buf = await buffer(req);
        const rawBody = buf.toString();
        const clerkEvent = JSON.parse(rawBody);
  
        console.log('Received event:', clerkEvent);
  
        if (clerkEvent.type === 'user.created') {
          const { id, email_addresses, first_name, last_name } = clerkEvent.data;
  
          // Log the data to be inserted
          console.log('Inserting user:', {
            id,
            email: email_addresses[0]?.email_address,
            first_name,
            last_name,
            subscription: 'invalid',
            credit_account: 1
          });
  
          // Add user data to Supabase
          const { error } = await supabaseServer.from('users').insert([
            {
              id,
              email: email_addresses[0]?.email_address,
              first_name,
              last_name,
              subscription: 'invalid',
              credit_account: 1
            },
          ]);
  
          if (error) {
            console.error('Error adding user to Supabase:', error);
            return res.status(500).json({ error: 'Error adding user to Supabase' });
          }
  
          return res.status(200).json({ message: 'User added to Supabase successfully' });
        }
  
        return res.status(400).json({ message: 'Unhandled event type' });
      } catch (error) {
        console.error('Error handling webhook:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
  };
  
  export default handler;