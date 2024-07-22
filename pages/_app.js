import "/styles/globals.css";
import Head from "next/head";
import Header from "../components/header";
import Footer from "../components/footer";
import { initializeSession } from "/utils/session";
import { useEffect, useState } from "react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

function InitializeSessionComponent({ setSessionId, setCredits }) {
  const { user } = useUser();

  useEffect(() => {
    const setupSession = async () => {
      const { sessionId, credits } = await initializeSession(!!user);

      if (!user && sessionId) {
        // If the user is not signed in and a sessionId is available
        setSessionId(sessionId);
        setCredits(credits);
      } else {
        // Handle the case when user is signed in or sessionId is not available
        setSessionId(null);
        setCredits(0);
      }

      console.log("Session ID:", sessionId);
      console.log("Credits:", credits);
    };

    setupSession();
  }, [user, setSessionId, setCredits]);

  return null;
}

export default function App({ Component, pageProps }) {
  const [sessionId, setSessionId] = useState(null);
  const [credits, setCredits] = useState(0);

  return (
    <>
      <ClerkProvider>
        <Head>
          <title>CreatAI</title>
          <link rel="icon" href="/images/logo/LogoCreatAI1.png" />
        </Head>
        <div style={{ backgroundColor: "black", color: "white" }}>
          <div className="bg-gradient-to-b from-slate-900 from-70% to-slate-800 to-95%">
            <Header />
            <InitializeSessionComponent
              setSessionId={setSessionId}
              setCredits={setCredits}
            />
            <Component
              {...pageProps}
              sessionId={sessionId}
              credits={credits}
              setCredits={setCredits}
            />
            <Footer />
          </div>
        </div>
      </ClerkProvider>
    </>
  );
}
