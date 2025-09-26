import { Request, Response } from "express";
import { imagekit } from "../lib/imagekit.js";
import sharp from "sharp";

import Gallery from "../models/gallery.model.js";
import { GalleryDocument } from "../types/gallery.js";

import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import csvParser from "csv-parser";

interface ParamsId {
    id: string;
}

export const getAllGallery = async (req: Request, res: Response) => {
    console.log("gallery.controller, getAllGallery");
    const galleries: GalleryDocument[] = await Gallery.find().sort({
        folderName: 1,
    });
    res.status(200).json(galleries);
};

// GET /gallery/images/:folderName
export const getGalleryImagesByFolder = async (req: Request, res: Response) => {
  const folderName = req.params.folderName;
  if (!folderName) {
    return res.status(400).json({ error: "folderName is required" });
  }

  const currentYear = new Date().getFullYear().toString();
  const imagekitFolder = `/${currentYear}/${folderName}`;
  console.log("gallery.controller getGalleryImagesByFolder ", imagekitFolder);
  try {
    // List files in ImageKit folder
    const result = await imagekit.listFiles({
      path: imagekitFolder,
      limit: 200, // adjust as needed
    });
    // Map to your frontend format
    const images = result.map((file: any) => ({
        fileType: file.fileType,
        url: file.url,
        name: file.name,
        fileId: file.fileId,
        thumbnail: file.thumbnail,
    }));

    res.status(200).json(images);
  } catch (err) {
    console.error("Error fetching images from ImageKit:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

export const createGallery = async (
    req: Request<{}, {}, Partial<GalleryDocument>>,
    res: Response
) => {
    console.log("gallery.controller, createGallery");

    try {
        const newGallery = new Gallery(req.body);
        const savedGallery = await newGallery.save();

        res.status(200).json(savedGallery);
    } catch (error) {
        console.error("gallery Save Failed:", error);
        res.status(500).json({ message: "Error creating gallery", error });
    }
};

export const updateGallery = async (
    req: Request<ParamsId, {}, Partial<GalleryDocument>>,
    res: Response
) => {
    try {
        const galleryId = req.params.id;
        const updateData = req.body;
        console.log("gallery.controller, updateGallery ", galleryId, req.params);
        console.log(updateData);

        const updatedGallery = await Gallery.findOneAndUpdate(
            { _id: galleryId },
            updateData,
            { new: true }
        );

        if (!updatedGallery) {
            return res.status(404).json({ message: "Gallery not found" });
        }

        res.status(200).json(updatedGallery);
    } catch (error) {
        console.error("Error updating Gallery:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/** Delete gallery */
export const deleteGallery = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    console.log("gallery.controller, deleteGallery");

    try {
        const deletedGallery = await Gallery.findByIdAndDelete(req.params.id);

        if (!deletedGallery) {
            return res
                .status(404)
                .json({ error: "Gallery not found for deletion" });
        }

        res.status(200).json({ message: "Gallery has been deleted" });
    } catch (err) {
        res.status(500).json({ error: "Gallery to delete officer" });
    }
};
//------------------------------- Import file -----------------------------------------------------------------------
//


export const uploadAuth = async (req: Request, res: Response): Promise<void> => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
};

export const importFile = async (req: Request, res: Response): Promise<void> => {
    console.log("gallery.controller, importFile");

    const file = req.file;
    const folderName = req.body.folderName;
    
    if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }
    if (!folderName) {
        res.status(400).json({ error: "No folderName specified" });
        return;
    }

    const currentYear = new Date().getFullYear().toString();
    const imagekitFolder = folderName
        ? `/${currentYear}/${folderName}`
        : `/${currentYear}/default`;
    const originalName = file.originalname;
    const extension = file.originalname.split('.').pop(); // get file extension
    const uniqueFileName = `${uuidv4()}.${extension}`;
    //console.log(`backend gallery.controller importFile folderName = ${imagekitFolder}`)
    try {
        //process image
        const processedBuffer = await sharp(file.path)
            .resize({ width: 1200 })      // aspect ratio maintained
            .jpeg({ quality: 80 })        // export quality 80%
            .toBuffer();
        
        // Upload to ImageKit
        // was before using sharp:             file: fs.createReadStream(file.path),
        const result = await imagekit.upload({
            file: processedBuffer,
            fileName: uniqueFileName,
            folder: imagekitFolder,
            customMetadata: {
                originalFilename: originalName
            }
        });

        // Remove temp file
        fs.unlink(file.path, (err) => {
        if (err) console.error("Failed to remove temp file:", err);
        });

        // Respond with ImageKit info
        res.status(200).json({
            message: "File uploaded successfully",
            url: result.url,
            thumbnailUrl: result.thumbnailUrl,
            fileId: result.fileId,
        });
    } catch (err: unknown) {
        console.error("ImageKit upload failed:", err);

        // Safely get message
        const message = err instanceof Error ? err.message : String(err);

        res.status(500).json({ error: message });
    }
};
