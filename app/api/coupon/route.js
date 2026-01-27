import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//Verify coupon

export const POST = async (req) => {
  try {
    const { userId, has } = getAuth(req);

    const { code } = await req.json();

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase(), expiresAt: { gt: new Date() } },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Coupon not found" },
        {
          status: 404,
        },
      );
    }

    if (coupon.forNewUser) {
      const userorders = await prisma.order.findMany({
        where: {
          userId,
        },
      });
      if (userorders.length > 0) {
        return NextResponse.json(
          { error: "Coupon valid only for new user" },
          {
            status: 400,
          },
        );
      }
    }

    if (coupon.forMember) {
      const hasPlusPlan = has({ plan: "plus" });
      if (!hasPlusPlan) {
        return NextResponse.json(
          { error: "Coupon valid only for members" },
          {
            status: 400,
          },
        );
      }
    }

    return NextResponse.json({ coupon }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
