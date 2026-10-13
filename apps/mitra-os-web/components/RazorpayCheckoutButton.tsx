import React, { useState } from "react";
import { useAnalyticsEvent } from "../hooks/useAnalyticsEvent";

interface RazorpayCheckoutButtonProps {
  amount: number; // in INR
  planName: string;
  className?: string;
}

export const RazorpayCheckoutButton: React.FC<RazorpayCheckoutButtonProps> = ({
  amount,
  planName,
  className,
}) => {
  const [loading, setLoading] = useState(false);
  const { trackEvent } = useAnalyticsEvent();

  const handlePayment = async () => {
    setLoading(true);
    trackEvent("payment_initiated", { plan_name: planName, amount });
    try {
      // 1. Create order on backend
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount * 100, // convert to paise
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      const order = await res.json();
      
      if (!res.ok) {
        throw new Error(order.error || "Order creation failed");
      }

      if (!order || !order.order_id) {
        throw new Error("Order creation failed: missing order_id");
      }

      // 2. Open Razorpay checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_dummy", // Enter the Key ID generated from the Dashboard
        amount: order.amount,
        currency: order.currency,
        name: "DukaanMitra",
        description: `Subscription for ${planName}`,
        order_id: order.order_id,
        handler: async function (response: any) {
          // 3. Verify signature on backend
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              trackEvent("payment_success", {
                plan_name: planName,
                amount,
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
              });
              alert("Payment successful!");
            } else {
              const errMsg = verifyData.error || "Unknown error";
              trackEvent("payment_verification_failed", {
                plan_name: planName,
                amount,
                error: errMsg,
              });
              alert("Payment verification failed: " + errMsg);
            }
          } catch (e: any) {
             trackEvent("payment_verification_error", {
               plan_name: planName,
               amount,
               error: e.message,
             });
             alert("Error during verification: " + e.message);
          }
        },
        prefill: {
          name: "Demo Merchant",
          email: "merchant@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#4f46e5", // indigo-600
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        trackEvent("payment_failed", {
          plan_name: planName,
          amount,
          error_code: response.error.code,
          error_description: response.error.description,
        });
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error: any) {
      console.error(error);
      trackEvent("payment_initialization_error", {
        plan_name: planName,
        amount,
        error: error.message,
      });
      alert(error.message || "Something went wrong during payment initialization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading} className={className}>
      {loading ? "Processing..." : `Pay ₹${amount}`}
    </button>
  );
};
