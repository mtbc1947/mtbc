// models/member.model.ts
import mongoose, { Schema, Document } from "mongoose";
import { GalleryDocument } from "../types/gallery.js";

const gallerySchema = new Schema<GalleryDocument>(
    {
        folderName: { type: String, required: true },
        title: { type: String, required: true },
        cover: { type: String, required: false },
        description: { type: String, required: false },
    },
    { timestamps: true }
);

const Gallery = mongoose.model<GalleryDocument>("Gallery", gallerySchema);

export default Gallery;
