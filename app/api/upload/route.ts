import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
// Vercel дээр файлын хэмжээний хязгаар (4.5MB default, 10MB болгоно)
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Admin нууц үг шалгах
    const authHeader = req.headers.get("x-admin-password");
    if (authHeader !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: "Зөвшөөрөлгүй" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "medclinic";

    if (!file) {
      return NextResponse.json({ success: false, error: "Файл олдсонгүй" }, { status: 400 });
    }

    // Файлын төрөл шалгах
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, error: "Зөвхөн зураг (jpg, png, webp) эсвэл бичлэг (mp4, mov) upload хийнэ үү" },
        { status: 400 }
      );
    }

    // Файлын хэмжээ шалгах: зураг 10MB, бичлэг 100MB
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `Файлын хэмжээ хэтэрсэн (${isVideo ? "100MB" : "10MB"})` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadToCloudinary(buffer, {
      folder,
      resource_type: isVideo ? "video" : "image",
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      public_id: result.public_id,
      type: isVideo ? "video" : "image",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Upload амжилтгүй болоо" }, { status: 500 });
  }
}
