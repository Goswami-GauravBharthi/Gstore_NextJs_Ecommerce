import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//Add new address
export const POST = async (req) => {
  try {
    const { userId } = getAuth(req);
    const { address } = await req.json();

    address.userId = userId;

    const newAddress = await prisma.address.create({ data: address });

    return NextResponse.json(
      { newAddress, message: "Address added successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

//Get all addresses
export const GET = async (req) => {
  try {
    const { userId } = getAuth(req);

    const addresses = await prisma.address.findMany({
      where: { userId },
    });

    return NextResponse.json({ addresses }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
