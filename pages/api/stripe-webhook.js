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
    const stripeSubType = session.metadata.subscriptionType;
    const stripeCreatedTime = session.created;

    console.log('User ID from metadata:', userId);

    if (!userId) {
      console.error(`Missing user ID in session metadata for event ${event.id}`);
      return res.status(400).send('Missing user ID in session metadata');
    }

    // Calculate the expiry date
    let expiryDate = new Date(stripeCreatedTime * 1000); // Convert UNIX timestamp to Date
    if (stripeSubType === '1m') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (stripeSubType === '1y') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    try {
      // Update the user's subscription status and expiry date in Supabase
      const { data, error } = await supabase
        .from('users')
        .update({
          subscription: 'active',
          stripe_id: stripeCustomerId,
          stripe_sub_type: stripeSubType,
          expiry_date: expiryDate.toISOString() // Convert Date to ISO format string
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
