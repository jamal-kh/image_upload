import { model, Schema } from "mongoose";

const imageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,      // original file name
    },

    key: {
      type: String,
      required: true,      // S3 object key (e.g. 1731772001-photo.png)
    },

    size: {
      type: Number,
      required: true,      // file size in bytes
    },

    mimeType: {
      type: String,
      required: true,      // image/png, image/jpeg, etc.
    },

    extension: {
      type: String,
      required: true,      // .jpg, .png, etc.
    },
  },
  {
    timestamps: true, // creates createdAt & updatedAt
  }
);

const imageModel = model("Images", imageSchema);

export default imageModel;
