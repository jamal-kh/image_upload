import cloudinary from "../config/cloudinary.js";

export class CloudinaryService {
  constructor(folder = "uploads") {
    this.folder = folder;
  }

  upload(file) {
    if (!file) throw new Error("No file provided");

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: this.folder,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            public_id: result.public_id
          });
        }
      );

      stream.end(file.buffer);
    });
  }

  async getUrl(publicId) {
    return cloudinary.url(publicId, {
      secure: false,
    });
  }
  
  delete(publicId) {
    return cloudinary.uploader.destroy(publicId);
  }
}