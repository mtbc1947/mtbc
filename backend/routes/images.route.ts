import express, { Request, Response } from "express";
import { getImages } from "../services/imagekit.js";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const folder = req.query.folder;

    if (!folder || typeof folder !== "string") {
        return res
            .status(400)
            .json({ error: "Missing or invalid folder parameter" });
    }

    try {
        const images = await getImages(folder);
        res.json(images);
    } catch (error: any) {
        console.error(
            "Error in /api/images:",
            error.response?.status,
            error.response?.data || error.message
        );
        res.status(500).json({ error: "Failed to fetch images" });
    }
});

export default router;
