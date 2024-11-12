// pages/api/check-subscription.js
import supabase from "../../config/supabaseConfig";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Query the database for the subscription status
  const { data, error } = await supabase
    .from("users")
    .select("subscription, credit_account")
    .eq("id", userId)
    .single();

  if (error) {
    return res
      .status(500)
      .json({ error: "Error fetching subscription status" });
  }

  return res
    .status(200)
    .json({
      subscription: data.subscription,
      credit_account: data.credit_account,
    });
}
