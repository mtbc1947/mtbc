import express from "express";
import { getImages } from "../services/imagekit.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const folder = req.query.folder; // 👈 read from query string

    if (!folder) {
        return res.status(400).json({ error: "Missing folder parameter" });
    }

    try {
        const images = await getImages(folder);
        res.json(images);
    } catch (error) {
        console.error(
            "Error in /api/images:",
            error.response?.status,
            error.response?.data || error.message
        );
        res.status(500).json({ error: "Failed to fetch images" });
    }
});

export default router;
