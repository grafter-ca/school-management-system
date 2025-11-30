import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

// Ensure directory exists
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

// Middleware for single image
export const uploadImage = async (req: any): Promise<UploadedFile> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 1 * 1024 * 1024, // 1MB
      multiples: false,
      filter: (part) => part.mimetype?.startsWith("image/") || false, // only images
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) return reject(new Error("No image uploaded"));

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

// Middleware for single generic file
export const uploadFile = async (req: any): Promise<UploadedFile> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 120 * 1024 * 1024, // 120MB
      multiples: false,
    });

    form.parse(req, (err, fields, files) => {
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
