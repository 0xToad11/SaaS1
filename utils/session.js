import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const initializeSession = async (isSignedIn) => {
  if (isSignedIn) {
    return { sessionId: null, credits: 0 }; // No need to initialize session if user is signed in
  }

  let sessionId = localStorage.getItem('session_id');
  let credits = 0;
  let sessionExpired = false;

  if (sessionId) {
    try {
      const response = await axios.post('/api/session-management', { sessionId });
      const { sessionExpired: expired, credits: sessionCredits } = response.data;

      sessionExpired = expired;
      credits = sessionCredits;

      if (sessionExpired) {
        localStorage.removeItem('session_id');
      }
    } catch (error) {
      console.error('Failed to check session:', error);
      sessionExpired = true;
      credits = 0;
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
