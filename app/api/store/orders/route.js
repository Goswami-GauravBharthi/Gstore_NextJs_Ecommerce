import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authseller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//Update seller order status
export const POST = async (req) => {
  try {
    const { userId } = getAuth(req);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await req.json();

    await prisma.order.update({
      where: { id: orderId, storeId },
      data: { status },
    });
    return NextResponse.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 },
    );
  }
};

//Get all order for seller

export const GET = async (req) => {
  try {
    const { userId } = getAuth(req);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { storeId },
      include: {
        user: true,
        address: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 },
    );
  }
};
