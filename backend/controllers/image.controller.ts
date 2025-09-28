import { Request, Response } from "express";
import { imagekit } from "../lib/imagekit.js";

// Minimal type describing what we actually need
interface ImageKitFile {
  filePath: string; // e.g. "gallery/image.jpg"
}

export const getImageFolders = async (req: Request, res: Response): Promise<void> => {
  console.log("image.controller, getImageFolders");

  try {
    const uniqueFolders = new Set<string>();
    let skip = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      // Cast result to our minimal type
      const files = (await imagekit.listFiles({
        path: "/",
        skip,
        limit,
        includeFolder: false,
      })) as ImageKitFile[];

      for (const file of files) {
        const filePath = file.filePath || "";
        if (filePath.includes("/")) {
          uniqueFolders.add(filePath.split("/")[0]);
        }
      }

      if (files.length < limit) {
        hasMore = false;
      } else {
        skip += limit;
      }
    }

    res.status(200).json(Array.from(uniqueFolders));
  } catch (error) {
    console.error("Error fetching ImageKit folders:", error);
    res.status(500).json({ error: "Failed to retrieve folders" });
  }
};

/**
 * DELETE /api/images/:fileId
 * Deletes an image from ImageKit using its fileId (identifier).
 */
export async function deleteImage(req: Request, res: Response) {
  const { fileId } = req.params;
  console.log("image.controller deleteImage fileId=", fileId);
  if (!fileId) {
    return res.status(400).json({ error: "Missing fileId parameter." });
  }

  try {
    await imagekit.deleteFile(fileId);
    return res.status(200).json({
      success: true,
      message: `Image with fileId '${fileId}' deleted successfully.`,
    });
  } catch (error: any) {
    console.error("Image deletion failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete image.",
      error: error?.message || String(error),
    });
  }
}
