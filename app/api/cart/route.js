import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Update user cart
export const POST = async (req) => {
  try {
    const { userId } = getAuth(req);

    const { cart } = await req.json();

    // save the cart to the user object

    await prisma.user.update({
      where: { id: userId },
      data: { cart: cart },
    });

    return NextResponse.json({ message: "Cart updated " });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// Get user cart
export const GET = async (req) => {
  try {
    const { userId } = getAuth(req);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { cart: true },
    });

    return NextResponse.json({ cart: user.cart }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
