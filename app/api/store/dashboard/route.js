import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authseller";
import { NextResponse } from "next/server";

// Get Dashboard Data for seller (total products,total orders,total earing)
export const GET = async (req) => {
  try {
    const { userId } = getAuth(req);
    const storeId = await authSeller(userId);
    if (!storeId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Get all order for seller

    const orders = await prisma.order.findMany({
      where: {
        storeId,
      },
    });

    // Get all products for seller

    const products = await prisma.product.findMany({
      where: {
        storeId,
      },
    });

    const rating = await prisma.rating.findMany({
      where: { productId: { in: products.map((product) => product.id) } },
      include: {
        product: true,
        user: true,
      },
    });

    const dashboardData = {
      rating,
      totalRating: rating.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalEarning: Math.round(
        orders.reduce((total, order) => total + order.total, 0),
      ),
    };
    return NextResponse.json({ dashboardData });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 },
    );
  }
};
