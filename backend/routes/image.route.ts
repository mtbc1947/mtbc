import express from "express";
import { getImageFolders, deleteImage } from "../controllers/image.controller.js";

const router = express.Router();

console.log("Image Route");

// Directly use the controller as the route handler
router.get("/folders", getImageFolders);
router.delete("/:fileId", deleteImage);

export default router;
