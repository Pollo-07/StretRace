import { ImageUploader } from "../../domain/user/ports/ImageUploader";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

export class CloudinaryService implements ImageUploader {
    
  async upload(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "usuarios" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }
}