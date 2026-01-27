import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (req) => {
  try {
    const { userId, has } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { orderData } = await req.json();
    const { addressId, items, paymentMethod, couponCode } = orderData;

    //check if al required fields are required

    if (
      !addressId ||
      !paymentMethod ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let coupon = null;
    let hasPlusPlan;
    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: {
          code: couponCode.toUpperCase(),
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!coupon) {
        return NextResponse.json(
          { error: "coupon not found" },
          { status: 400 },
        );
      }

      //validate coupon
      if (couponCode && coupon.forNewUser) {
        const userOrders = await prisma.order.findMany({
          where: {
            userId,
          },
        });
        if (userOrders.length > 0) {
          return NextResponse.json(
            { error: "Coupon valid only for new user" },
            { status: 400 },
          );
        }
      }
      hasPlusPlan = has({ plan: "plus" });

      if (couponCode && coupon.forMember) {
        if (!hasPlusPlan) {
          return NextResponse.json(
            { error: "Coupon valid only for members" },
            { status: 400 },
          );
        }
      }
    }

    // Group ordres by storeId using a map

    const ordersByStore = new Map();

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: {
          id: item.id,
        },
      });
      const storeId = product.storeId;
      if (!ordersByStore.has(storeId)) {
        ordersByStore.set(storeId, []);
      }
      ordersByStore.get(storeId).push({ ...item, price: product.price });
    }

    let orderIds = [];
    let fullAmount = 0;
    let isShipppingFeeAdded = false;

    //Creat order for each seller

    for (const [storeId, sellerItems] of ordersByStore.entries()) {
      let total = sellerItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      if (couponCode) {
        total -= (total * coupon.discount) / 100;
      }
      if (!hasPlusPlan && !isShipppingFeeAdded) {
        total += 50;
        isShipppingFeeAdded = true;
      }
      fullAmount += parseFloat(total.toFixed(2));
      const order = await prisma.order.create({
        data: {
          userId,
          storeId,
          addressId,
          paymentMethod,

          total: parseFloat(total.toFixed(2)),
          isCouponUsed: coupon ? true : false,
          coupon: coupon ? coupon : {},
          orderItems: {
            create: sellerItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
      orderIds.push(order.id);
    }


    // if payment method is stripe then ..
    if (paymentMethod === "STRIPE") {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const origin = await req.headers.get("origin");

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "Order",
              },
              unit_amount: Math.round(fullAmount * 100),
            },
            quantity: 1,
          },
        ],
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        mode: "payment",
        success_url: `${origin}/loading?nextUrl=orders`,
        cancel_url: `${origin}/cart`,
        metadata: { orderIds: orderIds.join(","), userId, appId: "Gstore" },
      });
      return NextResponse.json({ session });
    }
    //clear the cart
    await prisma.user.update({
      where: { id: userId },
      data: { cart: {} },
    });

    return NextResponse.json({ message: "Order place succefully " });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};

// Get all order for a user

export const GET = async (req) => {
  try {
    const { userId } = await auth();

    const orders = await prisma.order.findMany({
      where: {
        userId,
        OR: [
          { paymentMethod: PaymentMethod.COD },
          { AND: [{ paymentMethod: PaymentMethod.STRIPE }, { isPaid: true }] },
        ],
      },
      include: {
        orderItems: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });


    return NextResponse.json({ orders });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
