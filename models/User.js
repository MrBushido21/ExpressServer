import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    favouriteAnime: {
        type: Array,
        default: []
    },
    favouriteAnimeIds: {
        type: Array,
        default: []
    },
    avatarUrl: String,
    profileBg: String
}, {
    timestamps: true
})

export default mongoose.model("User", UserSchema)