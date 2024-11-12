import { v4 as uuidv4 } from "uuid";
import supabase from "/config/supabaseConfig";

export const initializeSession = async (isSignedIn) => {
  if (isSignedIn) {
    return { sessionId: null, credits: 0 }; // No need to initialize session if user is signed in
  }

  let sessionId = localStorage.getItem("session_id");
  let sessionExpired = false;
  let credits = 0;

  if (sessionId) {
    const { data, error } = await supabase
      .from("SessionDB")
      .select("expiry, credits")
      .eq("session_id", sessionId)
      .single();
    if (error || !data || new Date(data.expiry) < new Date()) {
      sessionExpired = true;
      await supabase.from("SessionDB").delete().eq("session_id", sessionId);
      localStorage.removeItem("session_id");
    } else {
      credits = data.credits;
    }
  }

  if (!sessionId || sessionExpired) {
    sessionId = uuidv4();
    localStorage.setItem("session_id", sessionId);

    try {
      const response = await axios.post("/api/add-session", { sessionId });
      const result = response.data;
      if (result.error) {
        console.error("Error creating session:", result.error);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  }

  return { sessionId, credits };
};
