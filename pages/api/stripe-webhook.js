import initStripe from "stripe";
import { buffer } from "micro";
import supabaseServer from "../../config/supabaseServerConfig";

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
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Retrieve user ID from metadata
    const userId = session.metadata.userId;
    const stripeCustomerId = session.customer;
    const stripeSubType = session.metadata.subscriptionType;
    const stripeCreatedTime = session.created;

    console.log("User ID from metadata:", userId);

    if (!userId) {
      console.error(
        `Missing user ID in session metadata for event ${event.id}`
      );
      return res.status(400).send("Missing user ID in session metadata");
    }

    try {
      if (stripeSubType === "10c") {
        // Fetch the current value of credit_account
        const { data: user, error: fetchError } = await supabaseServer
          .from("users")
          .select("credit_account")
          .eq("id", userId)
          .single();

        if (fetchError) {
          console.error("Error fetching user credit_account:", fetchError);
          return res.status(500).send("Error fetching user credits");
        }

        const currentCredit = user?.credit_account || 0; // Default to 0 if null
        const newCredit = currentCredit + 10;

        // Update the credit_account with the incremented value
        const { data, error: updateError } = await supabaseServer
          .from("users")
          .update({
            credit_account: newCredit,
            stripe_id: stripeCustomerId,
            stripe_sub_type: stripeSubType,
          })
          .eq("id", userId);

        if (updateError) {
          console.error("Error updating user credits:", updateError);
          return res.status(500).send("Error updating user credits");
        }

        console.log("User credits updated successfully:", data);
      } else {
        // Calculate the expiry date for monthly or yearly subscriptions
        let expiryDate = new Date(stripeCreatedTime * 1000); // Convert UNIX timestamp to Date
        if (stripeSubType === "1m") {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else if (stripeSubType === "1y") {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }

        // Update subscription status, stripe_id, stripe_sub_type, and expiry_date
        const { data, error } = await supabaseServer
          .from("users")
          .update({
            subscription: "active",
            stripe_id: stripeCustomerId,
            stripe_sub_type: stripeSubType,
            expiry_date: expiryDate.toISOString(), // Convert Date to ISO format string
          })
          .eq("id", userId);

        if (error) {
          console.error("Error updating user subscription:", error);
          return res.status(500).send("Error updating user subscription");
        }

        console.log("User subscription updated successfully:", data);
      }
    } catch (error) {
      console.error("Error updating database:", error);
      return res.status(500).send("Error updating database");
    }
  }

  res.send({ received: true });
};

export default handler;
