import { buffer } from "micro";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { stripeCustomerId } = req.body;

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: process.env.NEXT_PUBLIC_STRIPE_RETURN_URL, // The URL to return to after managing billing
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Error creating billing portal session:", error);
      res.status(500).json({ error: "Error creating billing portal session" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
