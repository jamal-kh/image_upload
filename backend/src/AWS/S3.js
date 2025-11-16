import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";

config();

const bucketName = process.env.AWS_BUCKET_NAME;

// Create S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
});

// Upload file to S3
export const uploadToS3 = async (file) => {
  if (!file) throw new Error("No file provided");

  const fileName = `${Date.now()}.${file.originalname.split(".").slice(-1)[0]}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  return fileName;
};


export const getPreSignedURL = async (key)=>{
  console.log(`S3 key: ${key}`);
  
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  })


  return await getSignedUrl(s3, command, {expiresIn: 600})
}