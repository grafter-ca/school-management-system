// /middleware/uploadSingleCloud.ts
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export interface UploadedFile {
  url: string;
  public_id: string;
}

export async function uploadSingleFileCloud(fileBlob: Blob): Promise<UploadedFile> {
  // Convert Blob -> Buffer
  const arrayBuffer = await fileBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "school-management/files",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);

          resolve({
            url: result!.secure_url,
            public_id: result!.public_id,
          });
        }
      )
      .end(buffer); // <-- send buffer to Cloudinary
  });
}
