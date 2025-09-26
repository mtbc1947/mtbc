import sharp from "sharp";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

// __dirname handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to your files
const inputFolder = path.join(
  process.env.HOME,
  "Documents/MTBC/2025/Downloads/testUpload"
);

// Folder to save converted images (can be inside your project)
const outputFolder = path.join(__dirname, "../converted");

// Ensure output folder exists
fs.ensureDirSync(outputFolder);

async function processImages() {
  const files = await fs.readdir(inputFolder);

  for (const file of files) {
    // Only process JPEG files
    if (!file.toLowerCase().endsWith(".jpeg") && !file.toLowerCase().endsWith(".jpg")) {
      console.log(`Skipping non-JPEG file: ${file}`);
      continue;
    }

    const inputPath = path.join(inputFolder, file);
    const outputPath = path.join(outputFolder, path.parse(file).name + ".jpg");

    try {
      await sharp(inputPath)
        .rotate()
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);

      console.log(`✅ Converted: ${file} → ${outputPath}`);
    } catch (err) {
      console.error(`❌ Failed to process ${file}:`, err.message);
    }
  }
}

processImages();
