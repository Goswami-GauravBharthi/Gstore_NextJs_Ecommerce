import { openai } from "@/config/openai";
import authSeller from "@/middlewares/authseller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const main = async (base64Image, mimeType) => {
  const messages = [
    {
      role: "system",
      content: ` You are a product listener assistant for an e-commerce store.
                 your job is to analyze an image of the product and generate structure data .
                 
                Response only with raw JSON (no code block, no markdown, no explanation).
                The JSON must strictly follow this schema:
    {
        "name": string,  //Short product name
        "description": string,  //Description must be friendly with icons in details
    }`,
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Analyze this image and return name + description.",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`,
          },
        },
      ],
    },
  ];

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages,
  });

  const raw = response.choices[0].message.content;

  //remove json formate

  const cleaned = raw.replace(/```json|```/g, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    throw new Error("AI did not return valid JSON");
  }

  return parsed;
};

export const POST = async (req) => {
  try {
    const { userId } = getAuth(req);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { base64Image, mimeType } = await req.json();
    if (!base64Image || !mimeType) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const result=await main(base64Image,mimeType);
    return NextResponse.json({...result },{status:200});
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
