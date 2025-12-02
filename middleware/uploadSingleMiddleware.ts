import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export interface UploadedFile {
  originalFilename: string | null;
  newFilename: string;
  filepath: string;
  mimetype: string | null;
  size: number;
}

// Middleware for single file (image or generic)
export const uploadSingleFile = async (req: Request, isImage = false): Promise<UploadedFile> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: isImage ? 1 * 1024 * 1024 : 120 * 1024 * 1024,
      multiples: false,
      filter: (part) => (isImage ? (part.mimetype?.startsWith("image/") ?? false) : true),
    });

    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err);

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) return reject(new Error("No file uploaded"));

      resolve({
        originalFilename: file.originalFilename,
        newFilename: path.basename(file.filepath),
        filepath: `/uploads/${path.basename(file.filepath)}`,
        mimetype: file.mimetype,
        size: file.size,
      });
    });
  });
};
