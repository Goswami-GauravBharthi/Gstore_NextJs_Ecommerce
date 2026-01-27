import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

//get store info and store products

export const GET = async (req) => {
  try {
    //Get store username from query params

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username")?.toLocaleLowerCase();

    if (!username) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    // get store info and inStck products with rating
    const store = await prisma.store.findUnique({
      where: {
        username,
      },
      include: {
        Product: {
          where: {
            inStock: true,
          },
          include: {
            rating: true,
          },
        },
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({ store });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 },
    );
  }
};
