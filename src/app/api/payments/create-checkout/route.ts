import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Stripe from "stripe";

let _stripe: Stripe | null = null;
function getStripe() {
  if (!_stripe && process.env.STRIPE_SECRET_KEY) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();

    const { token } = await (auth() as any).api.getToken({
      headers: headersList as any,
    });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const session = await auth().api.getSession({
      headers: headersList as any,
    });

    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { planId, planName, price, interval } = await request.json();

    if (!planId || !price) {
      return NextResponse.json(
        { success: false, message: "planId and price are required" },
        { status: 400 }
      );
    }

    const userPlan = (user as any).plan || "free_seeker";
    if (userPlan === planId) {
      return NextResponse.json(
        { success: false, message: "You are already on this plan" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { success: false, message: "Stripe not configured. Set STRIPE_SECRET_KEY in .env.local" },
        { status: 503 }
      );
    }

    const origin = headersList.get("origin") || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(Number(price) * 100),
            product_data: {
              name: planName || planId,
            },
            recurring: {
              interval: interval === "year" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        planId,
      },
      mode: "subscription",
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
    });

    return NextResponse.json({
      success: true,
      data: { url: checkoutSession.url, sessionId: checkoutSession.id },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create checkout" },
      { status: err.statusCode || 500 }
    );
  }
}
