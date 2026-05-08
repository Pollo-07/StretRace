export interface ImageUploader {
  upload(buffer: Buffer): Promise<string>;
}