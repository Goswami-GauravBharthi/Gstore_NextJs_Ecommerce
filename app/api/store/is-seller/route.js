//Auth seller
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authseller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const { userId } = getAuth(req);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const storeInfo = await prisma.store.findUnique({
      where: {
        userId,
      },
    });

    return NextResponse.json({ isSeller, storeInfo });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 },
    );
  }
};
