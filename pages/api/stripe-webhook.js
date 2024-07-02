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
    const stripeCustomerId = session.customer;

    console.log('User ID from metadata:', userId);

    if (!userId) {
      console.error(`Missing user ID in session metadata for event ${event.id}`);
      return res.status(400).send('Missing user ID in session metadata');
    }

    try {
      // Update the user's subscription status in Supabase
      const { data, error } = await supabase
        .from('users')
        .update({ subscription: 'active', stripe_id: stripeCustomerId })
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
