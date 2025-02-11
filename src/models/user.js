import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    user_name: String,
    user_position: String,
    rating: Number,
    description: String,
    image: String,
    categories: String,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
