import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Add new coupon
export const POST = async (req) => {
  try {
    const { userId } = getAuth(req);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { coupon } = await req.json();
    coupon.code = coupon.code.toUpperCase();

    await prisma.coupon.create({ data: coupon }).then(async (coupon) => {
      //Run inngest sheduler function to delete coupon on expire
      await inngest.send({
        name: "app/coupon.expired",
        data: {
          code: coupon.code,
          expires_at: coupon.expiresAt,
        },
      });
    });

    return NextResponse.json(
      { message: "Coupon added successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// Delete coupon  /api/admin/coupon?id=couponId
export const DELETE = async (req) => {
  try {
    const { userId } = getAuth(req);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const code = req.nextUrl.searchParams.get("code");

    await prisma.coupon.delete({ where: { code } });

    return NextResponse.json(
      { message: "Coupon deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// get all coupons
export const GET = async (req) => {
  try {
    const { userId } = getAuth(req);
    console.log(userId);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany();

    return NextResponse.json({ coupons }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
