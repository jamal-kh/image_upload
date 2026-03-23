
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { CloudinaryService } from "./services/CloudinaryService.js";
import upload from "./middlewares/multer.js"
import config from "./config/config.js";
import imageModel from "./model/image.model.js";

const server = express();
const port = 5000;
const cloudinary = new CloudinaryService();

mongoose.connect(config.monogoUrl)
    .then(() => {
        console.log("The connection created successfully");
    })
    .catch((e) => {
        console.log("The connection fails", e);
    })


server.use(cors({
    origin: "*",
}));


server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));



server.get("/", (req, res) => {
    res.sendFile("index.html");
});

server.post("/upload", upload, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        const file = req.file;

        // upload to Cloudinary
        const { url, public_id } = await cloudinary.upload(file);

        // save to DB
        await imageModel.create({
            name: file.originalname,
            key: public_id,
            size: file.size,
            mimeType: file.mimetype,
            extension: file.originalname.split(".").pop(),
        });

        const [randomImage] = await imageModel.aggregate([
            { $sample: { size: 1 } }
        ]);

        const getImage = await cloudinary.getUrl(randomImage.key);

        res
            .status(200)
            .json({
                imageUrl: getImage
            });

    } catch (err) {
        console.error(err);
        res.status(500).send("Upload failed");
    }
});



server.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`)
})
