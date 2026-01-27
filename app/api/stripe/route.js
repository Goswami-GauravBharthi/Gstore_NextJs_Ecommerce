import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// stripe webhook to verify payment intent(status)=> if user through stripe make payment then this webhook will verify payment intent(status) , if payment is successful then change order status to isPaid=true and clear cart data from user , if payment is failed then delete order from database..
export const POST = async (req) => {
  try {
    const body = await req.text();

    const sig = req.headers.get("stripe-signature");

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    const handlePaymentIntent = async (paymentIntentId, isPaid) => {
      const session = await stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderIds, userId, appId } = session.data[0].metadata;

      if (appId !== "gstore") {
        return NextResponse.json(
          { received: true, error: "Invalid app id" },
          { status: 400 },
        );
      }

      const orderIdsArray = orderIds.split(",");

      if (isPaid) {
        //change order payment status => isPaid=true
        await Promise.all(
          orderIdsArray.map(async (id) => {
            await prisma.order.update({
              where: {
                id,
              },
              data: {
                isPaid: true,
              },
            });
          }),
        );

        // clear the cart data from user
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: { cart: {} },
        });
      } else {
        // delete order from database..

        await Promise.all(
          orderIdsArray.map(async (id) => {
            await prisma.order.delete({
              where: {
                id,
              },
            });
          }),
        );
      }
    };

    switch (event.type) {
      case "payment_intent.succeeded": {
        await handlePaymentIntent(event.data.object.id, true);
        break;
      }
      case "payment_intent.canceled": {
        await handlePaymentIntent(event.data.object.id, false);
        break;
      }

      default:
        console.log("Unhandled event type", event.type);
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.log("Error in webhook", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
