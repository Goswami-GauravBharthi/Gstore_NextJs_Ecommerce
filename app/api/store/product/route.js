import imagekit from "@/config/imagekit";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authseller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { userId } = getAuth(req);
    const storeId = await authSeller(userId);
    if (!storeId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    //get form data
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const images = formData.getAll("images");
    const category = formData.get("category");

    if (!name || !description || !price || images.length === 0 || !category) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    //uploading Images to Imagekit

    const imageUrl = await Promise.all(
      images.map(async (image) => {
        const buffer = Buffer.from(await image.arrayBuffer());

        const response = await imagekit.upload({
          file: buffer,
          fileName: image.name,
          folder: "products",
        });

        const url = imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "512" },
          ],
        });

        return url;
      }),
    );

    await prisma.product.create({
      data: {
        name,
        description,
        mrp,
        price,
        images: imageUrl,
        category,
        storeId,
      },
    });

    return NextResponse.json({ message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 },
    );
  }
};

//Get all product for a seller

export const GET = async (req) => {
  try {
    const { userId } = getAuth(req);
    const storeId = await authSeller(userId);
    if (!storeId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 },
    );
  }
};
