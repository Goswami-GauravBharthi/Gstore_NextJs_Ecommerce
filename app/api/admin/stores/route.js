import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// get all approved stores
export const GET = async (req) => {
  try {
    const { userId } = getAuth(req);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const stores = await prisma.store.findMany({
      where: { status: "approved" },
      include: {
        user: true,
      },
    });
    return NextResponse.json({stores}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
