import initStripe from "stripe";
import { buffer } from "micro";
import supabase from '/config/supabaseConfig';

export const config = { api: { bodyParser: false } };

const handler = async (req, res) => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers["stripe-signature"];
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const reqBuffer = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
  } catch (error) {
    console.log(error);
    return res.status(400).send(`webhook error: ${error.message}`);
  }

  console.log({ event });
  console.log("event received");

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Retrieve user ID from metadata
    const userId = session.metadata.userId;
    const subType = session.metadata.subscriptionType;
    const stripeCustomerId = session.customer;
    const subId = session.subscription;

    // Extract the created timestamp
    const stripeCreatedAt = session.created;
    
    console.log('User ID from metadata:', userId);
    console.log('Stripe Created At:', stripeCreatedAt);

    if (!userId) {
      console.error(`Missing user ID in session metadata for event ${event.id}`);
      return res.status(400).send('Missing user ID in session metadata');
    }

    try {
      // Fetch the user's current expiry date from Supabase
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('stripe_expiry_date')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching user data:', fetchError);
        return res.status(500).send('Error fetching user data');
      }

      let expiryDate = new Date();
      if (userData.stripe_expiry_date) {
        expiryDate = new Date(userData.stripe_expiry_date);
      }

      // Update the expiry date based on the subscription type
      if (subType === '1m') {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else if (subType === '1y') {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }

      // Update the user's subscription status in Supabase
      const { data, error } = await supabase
        .from('users')
        .update({
          subscription: 'active',
          stripe_id: stripeCustomerId,
          stripe_created_at: new Date(stripeCreatedAt * 1000).toISOString(), // Convert to ISO format
          stripe_sub_id: subId,
          stripe_sub_type: subType,
          stripe_expiry_date: expiryDate.toISOString() // Convert to ISO format
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user subscription:', error);
        return res.status(500).send('Error updating user subscription');
      }

      console.log('User subscription updated successfully:', data);
    } catch (error) {
      console.error('Error updating database:', error);
      return res.status(500).send('Error updating database');
    }
  }

  res.send({ received: true });
};

export default handler;
