import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { Product } from "./model/product.model.js";
import connectToDB from "./db/dbConnect.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5001;

const s3Client = new S3Client({
  region: "eu-north-1", //bucket region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const createPresignedUrlWithClient = ({ bucket, key }) => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

app.post("/api/get-presigned-url", async (req, res) => {
  try {
    const { mime } = req.body;
    const filename = uuidv4();
    const finalName = `${filename}.${mime}`;

    const url = await createPresignedUrlWithClient({
      bucket: process.env.S3_BUCKET_NAME,
      key: finalName, //file name //should be dynamic
    });

    res.status(200).json({
      url: url,
      filename: finalName,
    });
  } catch (err) {
    console.error("Error generating presigned URL:", err);
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to get products" });
  }
});

app.post("/api/add-product", async (req, res) => {
  const { name, description, price, filename } = req.body;

  //todo: validate request using zod

  if (!name || !description || !price || !filename) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const product = await Product.create({
    name,
    description,
    price,
    filename,
  });

  res.status(201).json({
    message: "Product created successfully",
    product,
  });
});

app.listen(PORT, () => {
  connectToDB();
  console.log("Server is running on port", PORT);
});
