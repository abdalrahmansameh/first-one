"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";

import { checkoutCredits } from "@/lib/actions/transaction.action";
import { Button } from "../ui/button";
import { toast } from "sonner";

const Checkout = ({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) => {
  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      toast("Order placed!", {
        description: "You will receive an email confirmation",
        duration: 5000,
      });
    }

    if (query.get("canceled")) {
      toast("Order canceled!", {
        description: "Continue to shop around and checkout when you're ready",
        duration: 5000,
      });
    }
  }, []);

  const onCheckout = async () => {
    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
    };

    await checkoutCredits(transaction);
  };

  return (
    <Button
      onClick={onCheckout}
      role="link"
      className="w-full rounded-full bg-purple-gradient bg-cover"
    >
      Buy Credit
    </Button>
  );
};

export default Checkout;
