import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith("sk_test_your")) {
      return NextResponse.json(
        { success: false, message: "Stripe not configured" },
        { status: 503 }
      );
    }

    const headersList = await headers();
    const { token } = await auth.api.getToken({ headers: headersList as any });
    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ success: false, message: "sessionId required" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ success: false, message: "Payment not completed" }, { status: 400 });
    }

    const planId = session.metadata?.planId;
    const userId = session.metadata?.userId;

    if (!planId || !userId) {
      return NextResponse.json({ success: false, message: "Invalid session metadata" }, { status: 400 });
    }

    const apiRes = await fetch(`${API_URL}/api/payments/update-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        planId,
        stripeSubscriptionId: session.subscription,
      }),
    });

    const apiData = await apiRes.json();
    return NextResponse.json(apiData, { status: apiRes.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Verification failed" },
      { status: 500 }
    );
  }
}
