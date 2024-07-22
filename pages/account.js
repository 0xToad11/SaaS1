import {
  SignedIn,
  SignedOut,
  SignIn,
  useUser,
  SignOutButton,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";
import supabase from "/config/supabaseConfig";

const Account = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("ManageSubscription");

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, email, first_name, last_name, subscription, stripe_sub_type, expiry_date"
      )
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
    } else {
      setUserData(data);
    }
  };

  const handleSubscription = async (priceId, subscriptionType) => {
    const response = await fetch("/api/stripe-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId, sessionId: user.id, subscriptionType }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("Error creating checkout session:", data.error);
    }
  };

  const handleBillingPortal = async () => {
    try {
      // Fetch the stripe_id from Supabase
      const { data, error } = await supabase
        .from("users")
        .select("stripe_id")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        console.error("Error fetching stripe_id from Supabase:", error);
        return;
      }

      const stripeCustomerId = data.stripe_id;

      // Create a billing portal session
      const response = await fetch("/api/stripe-manage-billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stripeCustomerId }),
      });

      const responseData = await response.json();

      if (responseData.url) {
        window.location.href = responseData.url;
      } else {
        console.error(
          "Error creating billing portal session:",
          responseData.error
        );
      }
    } catch (error) {
      console.error("Error handling billing portal:", error);
    }
  };

  return (
    <div className="flex">
      <SignedIn>
        <div className="w-1/2 lg:w-1/5 p-4 lg:px-12 lg:pt-12 bg-gradient-to-b from-cyan-500 to-blue-600 text-white h-90 rounded-2xl">
          <ul className="space-y-4 mb-20">
            <div className="text-center lg:pb-12 text-lg lg:text-xl font-semibold">
              CreatAI Account
            </div>
            <li
              className={`cursor-pointer flex hover:opacity-90 ${
                activeTab === "General" ? "font-bold opacity-100" : "opacity-70"
              }`}
              onClick={() => setActiveTab("General")}
            >
              <img
                src="/images/accountpage/GeneralIcon.png"
                alt="General"
                className="w-6 h-6 lg:w-8 lg:h-8"
              />
              <div className="ml-2 pt-0 lg:pt-1 text-sm lg:text-base">
                General
              </div>
            </li>
            <li
              className={`cursor-pointer flex hover:opacity-90 ${
                activeTab === "Settings"
                  ? "font-bold opacity-100"
                  : "opacity-70"
              }`}
              onClick={() => setActiveTab("Settings")}
            >
              <img
                src="/images/accountpage/SettingsIcon.png"
                alt="Settings"
                className="w-6 h-6 lg:w-8 lg:h-8"
              />
              <div className="ml-2 pt-0 lg:pt-1 text-sm lg:test-base">
                Settings
              </div>
            </li>
            <li
              className={`cursor-pointer flex hover:opacity-90 ${
                activeTab === "ManageSubscription"
                  ? "font-bold opacity-100"
                  : "opacity-70"
              }`}
              onClick={() => setActiveTab("ManageSubscription")}
            >
              <img
                src="/images/accountpage/ManageSubIcon.png"
                alt="Manage Subscription"
                className="w-6 h-6 lg:w-8 lg:h-8"
              />
              <div className="ml-2 pt-0 lg:pt-1 text-sm lg:text-base">
                Manage Subscription
              </div>
            </li>
            <div className="pt-60 lg:pt-60"></div>
            <SignOutButton>
              <li
                className={`cursor-pointer flex justify-center pr-2${
                  activeTab === "Logout" ? "font-bold" : ""
                }`}
              >
                <img
                  src="images/accountpage/LogOutIcon.png"
                  alt="Logout"
                  className="w-10 lg:w-12 opacity-80 hover:opacity-100"
                />
              </li>
            </SignOutButton>
          </ul>
        </div>
        <div className="w-3/4 p-4 pl-4 lg:pl-12">
          {userData ? (
            <>
              {activeTab === "General" && (
                <div>
                  <h1 className="text-3xl font-semibold">General</h1>
                  <div className="lg:grid grid-cols-2 gap-4 pt-4 lg:pt-12 text-sm lg:text-lg">
                    <div>Name:</div>
                    <div className="pb-4 lg:pb-0">
                      {userData.first_name} {userData.last_name}
                    </div>
                    <div>Email:</div>
                    <div className="pb-4 lg:pb-0">{userData.email}</div>
                    <div>Subscription:</div>
                    <div className="flex items-center">
                      {userData.subscription === "active" ? (
                        <span className="h-4 w-4 bg-green-500 rounded-full mr-2"></span>
                      ) : (
                        <span className="h-4 w-4 bg-red-500 rounded-full mr-2"></span>
                      )}
                      <div>{userData.subscription}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Settings" && (
                <div>
                  <h1 className="text-3xl font-semibold">Settings</h1>
                  {/* <p className="pt-4 lg:pt-12 lg:text-lg">
                    Name: {userData.first_name} {userData.last_name}
                  </p>
                  <p className="pt-1 lg:pt-2 lg:text-lg">Email: {userData.email}</p>
                  <p className="pt-1 lg:pt-2 lg:text-lg">Subscription: {userData.subscription}</p> */}
                </div>
              )}
              {activeTab === "ManageSubscription" && (
                <div>
                  <h1 className="text-3xl font-semibold">
                    Manage Subscription
                  </h1>
                  {userData.subscription === "invalid" ? (
                    <div>
                      <div className="pt-4 lg:pt-12 text-sm lg:text-lg">
                        Subscription: {userData.subscription}
                      </div>
                      <div className="pt-4 lg:pt-20 text-xs lg:text-base mb-12 lg:mb-0">
                        Subscribe to have full access!
                      </div>
                      <div className="lg:flex pt-2 lg:pt-12">
                        <div className="rounded-xl pb-2 lg:pb-0 w-40 lg:h-80 lg:w-60 bg-gradient-to-b from-slate-500 to-slate-900 mr-0 lg:mr-24 image-scale">
                          <div className="text-center lg:text-3xl font-semibold pt-8">
                            Hobby
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="pt-4 lg:pt-12 lg:text-5xl line-through text-slate-400 opacity-50">
                              $8
                            </div>
                            <div className="pt-4 lg:pt-12 pl-2 lg:text-5xl text-slate-200">
                              $5
                            </div>
                          </div>
                          <div className="pt-4 lg:pt-8 text-center">
                            - per month
                          </div>
                          <div className="text-center">- unlimited access</div>
                          <div className="flex justify-center">
                            <button
                              onClick={() =>
                                handleSubscription(
                                  process.env.NEXT_PUBLIC_STRIPE_1M_SUB,
                                  "1m"
                                )
                              }
                              className="mt-4 px-4 py-2 button-29-sub text-white rounded"
                            >
                              Subscribe
                            </button>
                          </div>
                        </div>
                        <div className="rounded-xl pb-2 lg:pb-0 w-40 mt-12 lg:mt-0 lg:h-80 lg:w-60 bg-gradient-to-b from-slate-500 to-slate-900 image-scale">
                          <div className="text-center lg:text-3xl font-semibold pt-8">
                            Business
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="pt-4 lg:pt-12 lg:text-5xl line-through text-slate-400 opacity-50">
                              $60
                            </div>
                            <div className="pt-4 lg:pt-12 pl-2 lg:text-5xl text-slate-200">
                              $50
                            </div>
                          </div>
                          <div className="pt-4 lg:pt-8 text-center">
                            - per year
                          </div>
                          <div className="text-center">- unlimited access</div>
                          <div className="flex justify-center">
                            <button
                              onClick={() =>
                                handleSubscription(
                                  process.env.NEXT_PUBLIC_STRIPE_1Y_SUB,
                                  "1y"
                                )
                              }
                              className="mt-4 px-4 py-2 button-29-sub text-white rounded"
                            >
                              Subscribe
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-4 lg:pt-12 text-sm lg:text-lg">
                      <div className="lg:grid grid-cols-2 gap-4">
                        <div>Subscription :</div>
                        <div className="pb-4 lg:pb-0 flex items-center">
                          {userData.subscription === "active" ? (
                            <span className="h-4 w-4 bg-green-500 rounded-full mr-2"></span>
                          ) : (
                            <span className="h-4 w-4 bg-red-500 rounded-full mr-2"></span>
                          )}
                          {userData.subscription}
                        </div>
                        <div>Subscription type :</div>
                        <div className="pb-4 lg:pb-0">
                          {userData.stripe_sub_type === "1m"
                            ? "$5 per month"
                            : "$50 per year"}
                        </div>
                        <div>Subscription end date :</div>
                        <div>
                          {new Date(userData.expiry_date).toLocaleString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              // second: "2-digit",
                              timeZone: "UTC",
                              timeZoneName: "short",
                            }
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleBillingPortal}
                        className="mt-4 px-4 py-2 button-79 text-white rounded"
                      >
                        Manage Billing
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </div>
  );
};

export default Account;
