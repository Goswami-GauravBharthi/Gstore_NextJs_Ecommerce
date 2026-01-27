import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Add new rating
export const POST = async (req) => {
  try {
    const { userId } = getAuth(req);

    const { orderId, productId, rating, review } = await req.json();

    if (!userId || !orderId || !productId || !rating || !review) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isAlredyRated = await prisma.rating.findFirst({
      where: { orderId, productId },
    });
    if (isAlredyRated) {
      return NextResponse.json(
        { error: "You have already rated this product" },
        { status: 400 },
      );
    }

    const response = await prisma.rating.create({
      data: {
        userId,
        orderId,
        productId,
        rating,
        review,
      },
    });

    return NextResponse.json({
      message: "Rating added successfully",
      rating: response,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 },
    );
  }
};

// Get all ratings for a product
export const GET = async (req) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ratings = await prisma.rating.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json({ ratings });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 },
    );
  }
};
