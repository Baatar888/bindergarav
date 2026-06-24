import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadToCloudinary(
  file: Buffer,
  options: {
    folder?: string;
    resource_type?: "image" | "video" | "auto";
    public_id?: string;
  } = {}
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || "medclinic",
      resource_type: options.resource_type || "auto",
      ...(options.public_id && { public_id: options.public_id }),
    };

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload амжилтгүй"));
          return;
        }
        resolve({ url: result.secure_url, public_id: result.public_id });
      })
      .end(file);
  });
}

export async function deleteFromCloudinary(publicId: string, resourceType: "image" | "video" = "image") {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error("Cloudinary delete error:", err);
  }
}
