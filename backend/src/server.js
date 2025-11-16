
import express from "express";
import upload from "./middlewares/multer.js";
import multer from "multer";
import { uploadToS3, getPreSignedURL } from "./AWS/S3.js";
import imageModel from "./model/image.model.js";
import mongoose from "mongoose";
import cors from "cors";

const server = express();
const port = 5000;

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("The connection created successfully");
    })
    .catch(() => {
        console.log("The connection fails");
    })


server.use(cors({
    origin: "*",
}))
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.post("/api/upload", upload, async (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error("The error happend in multer can you check")
        }
    })

    try {
        const file = req.file;

        const uploadResult = await uploadToS3(file);

        console.log("image uploading");

        imageModel.insertOne({
            name: file.originalname,
            key: uploadResult,
            size: file.size,
            mimeType: file.mimetype,
            extension: file.originalname.split(".").slice(-1)[0],
        })

        const url = await getPreSignedURL(uploadResult)
        res.json({
            succes: true,
            message: "the Image has been uploaded successfully",
            url,
            key:uploadResult
        })
    } catch (err) {
        console.error("Error when upload a image to S3");
    }
});


server.get("/api/random/image", async (req, res) => {
    try {
        const randomImage = await imageModel.aggregate([{ $sample: { size: 1 } }]);

        if (randomImage.length === 0) {
            return res.status(404).json({ message: "No images found" });
        }


        const imageURl = await getPreSignedURL(randomImage[0].key);

        res.json({
            result: imageURl,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

server.get("/api/image/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const imagekey = await imageModel.findById(id).select("key");

        const imageURl = await getPreSignedURL(imagekey["key"]);

        res.json({
            url: imageURl,
        })
    } catch (err){
        console.error("error in get image route: "+ err);
    }
})

server.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`)
})