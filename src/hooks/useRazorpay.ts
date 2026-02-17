import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from "@/lib/auth";

const RAZORPAY_KEY_ID = "rzp_test_SGJlMugI0Soq4A";

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayPaymentFailedResponse {
  error: {
    description: string;
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  modal: {
    ondismiss: () => void;
  };
  prefill: {
    email: string | null;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  on: (event: "payment.failed", handler: (response: RazorpayPaymentFailedResponse) => void) => void;
  open: () => void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

export function useRazorpay() {
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [purchasedProduct, setPurchasedProduct] = useState<string | null>(null);
  const { user } = useAuth();

  const handlePurchase = async (productName: string, price: number) => {
    if (processing) return;

    setPaymentSuccess(false);
    setPurchasedProduct(null);

    if (!user) {
      toast.error("Please log in to continue");
      window.location.href = "/auth";
      return;
    }

    const isDev =
      typeof window !== "undefined" &&
      window.location.search.includes("testPayment=true") &&
      import.meta.env.MODE === "development";

    if (isDev) {
      const query = new URLSearchParams({
        productName,
        amount: String(price),
        paymentId: "TEST_MODE",
      }).toString();
      window.location.href = `/payment-success?${query}`;
      return;
    }

    setProcessing(true);

    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        toast.error("Please log in to continue");
        setProcessing(false);
        return;
      }

      const { data: orderData, error: orderError } = await supabase.functions.invoke("create-razorpay-order", {
        body: { productName, amount: price },
      });

      if (orderError || !orderData?.order_id) {
        toast.error("Failed to create order. Please try again.");
        setProcessing(false);
        return;
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: price * 100,
        currency: "INR",
        name: "Next Developer",
        description: productName,
        order_id: orderData.order_id,
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke("verify-razorpay-payment", {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                product_name: productName,
                amount: price,
              },
            });

            if (verifyError || !verifyData?.success) {
              toast.error("Payment verification failed. Contact support.");
              setProcessing(false);
              return;
            }

            setPaymentSuccess(true);
            setPurchasedProduct(productName);
            setProcessing(false);
            toast.success("Payment Successful 🎉");

            const query = new URLSearchParams({
              productName,
              amount: String(price),
              paymentId: response.razorpay_payment_id,
            }).toString();

            window.location.href = `/payment-success?${query}`;
          } catch {
            toast.error("Verification error. Contact support.");
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            toast.warning("Payment cancelled");
            setProcessing(false);
          },
        },
        prefill: { email: user.email },
        theme: { color: "#6C5CE7" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: RazorpayPaymentFailedResponse) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setProcessing(false);
    }
  };

  return { handlePurchase, processing, paymentSuccess, purchasedProduct };
}
