import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbMongoose";
import cloudinary from "@/utils/cloudinary";
import UserProfile from "@/models/UserProfile";

export async function POST(req) {
    await dbConnect();
    const formData = await req.formData();
    const { userId, intro, bio, description } = Object.fromEntries(formData);

    let imageUrl = "";
    const image = formData.get("image");

    try {
        if (image) {
            const imageBuffer = await image.arrayBuffer();
            const base64 = Buffer.from(imageBuffer).toString("base64");
            const uploadResult = await cloudinary.uploader.upload(`data:image/png;base64,${base64}`, {
                folder: "profile_images",
            });
            imageUrl = uploadResult.secure_url;
        }

        const updatedUser = await UserProfile.findOneAndUpdate(
            { userId },
            { image: imageUrl, intro, bio, description },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: updatedUser });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message });
    }
}
