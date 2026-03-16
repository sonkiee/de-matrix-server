import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = (fileBuffer: Buffer, filename: string) => {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", public_id: filename },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url ?? filename);
      },
    );
    stream.end(fileBuffer);
  });
};
