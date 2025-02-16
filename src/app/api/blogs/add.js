// src/pages/api/blogs/add.js



import { v4 as uuidv4 } from "uuid";
import formidable from "formidable";
import { writeFile } from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/dbConnect";

export const config = {
    api: {
        bodyParser: false, // For handling FormData
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const db = await connectDB();
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: "Error parsing form data" });
        }

        // Save Images to Public Folder
        let imageUrls = [];
        if (files.images) {
            const imageFiles = Array.isArray(files.images) ? files.images : [files.images];

            for (const file of imageFiles) {
                const fileExtension = path.extname(file.originalFilename);
                const fileName = `${uuidv4()}${fileExtension}`;
                const filePath = path.join(process.cwd(), "public/uploads", fileName);

                await writeFile(filePath, await file.toBuffer());
                imageUrls.push(`/uploads/${fileName}`);
            }
        }

        // Insert Data into MongoDB
        const blog = {
            title: fields.title,
            description: fields.description,
            content: fields.content,
            tags: fields.tags?.split(",").map((tag) => tag.trim()) || [],
            metaTitle: fields.metaTitle,
            metaDescription: fields.metaDescription,
            images: imageUrls,
            createdAt: new Date(),
        };

        const result = await db.collection("blogs").insertOne(blog);
        if (result.insertedId) {
            res.status(201).json({ success: true, message: "Blog post added successfully" });
        } else {
            res.status(500).json({ error: "Failed to add blog post" });
        }
    });
}


