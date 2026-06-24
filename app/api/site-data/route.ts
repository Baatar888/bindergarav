import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteDataModel } from "@/lib/models";
import { defaultData } from "@/lib/data";

// GET - сайтын мэдээллийг авах
export async function GET() {
  try {
    await connectDB();
    let doc = await SiteDataModel.findOne().lean();

    if (!doc) {
      // Анх удаа: default өгөгдөл хадгалах
      const created = await SiteDataModel.create(defaultData);
      doc = created.toObject();
    }

    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error("GET /api/site-data error:", error);
    return NextResponse.json({ success: false, error: "Серверийн алдаа" }, { status: 500 });
  }
}

// POST - мэдээлэл шинэчлэх
export async function POST(req: Request) {
  try {
    // Admin нууц үг шалгах (header-ээр)
    const authHeader = req.headers.get("x-admin-password");
    if (authHeader !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: "Зөвшөөрөлгүй" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    // _id, __v талбаруудыг хасах
    const { _id, __v, createdAt, updatedAt, ...updateData } = body;
    void _id; void __v; void createdAt; void updatedAt;

    const doc = await SiteDataModel.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, lean: true }
    );

    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error("POST /api/site-data error:", error);
    return NextResponse.json({ success: false, error: "Хадгалахад алдаа гарлаа" }, { status: 500 });
  }
}
