// import { buffer } from "micro";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const { stripeCustomerId } = req.body;

//     try {
//       const session = await stripe.billingPortal.sessions.create({
//         customer: stripeCustomerId,
//         return_url: process.env.NEXT_PUBLIC_STRIPE_RETURN_URL, // The URL to return to after managing billing
//       });

//       res.status(200).json({ url: session.url });
//     } catch (error) {
//       console.error("Error creating billing portal session:", error);
//       res.status(500).json({ error: "Error creating billing portal session" });
//     }
//   } else {
//     res.setHeader("Allow", "POST");
//     res.status(405).end("Method Not Allowed");
//   }
// }

// pages/api/stripe-manage-billing.js
import supabaseServer from '../../config/supabaseServerConfig';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Fetch the stripe_id from Supabase
  const { data, error } = await supabaseServer
    .from('users')
    .select('stripe_id')
    .eq('id', userId)
    .single();

  if (error || !data || !data.stripe_id) {
    return res.status(500).json({ error: 'Error fetching stripe_id from Supabase' });
  }

  const stripeCustomerId = data.stripe_id;

  // Create a Stripe billing portal session
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: process.env.RETURN_URL, // URL to return to after managing billing
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (stripeError) {
    console.error("Error creating billing portal session:", stripeError);
    return res.status(500).json({ error: 'Error creating billing portal session' });
  }
}
