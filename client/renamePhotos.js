// renamePhotos.js
// Run with: node renamePhotos.js

import fs from "fs";
import path from "path";

// Path to your galleries file
const galleriesPath = "./src/galleries.ts";

// Root folder containing photos
const photosRoot = "./public/photos";

// Helper to generate safe filename
function cleanFilename(name) {
  return name
    .toLowerCase()
    .replace(/ /g, "_")     // spaces → _
    .replace(/\(/g, "-")    // ( → -
    .replace(/\)/g, "")     // ) → removed
    .replace(/_-+/g, "-");  // _- → -
}

// Recursively rename files in folder
function renameFilesRecursively(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      renameFilesRecursively(fullPath);
    } else if (item.isFile()) {
      const ext = path.extname(item.name);
      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext.toLowerCase())) {
        const safeName = cleanFilename(item.name);
        const newFullPath = path.join(dir, safeName);
        if (fullPath !== newFullPath) {
          fs.renameSync(fullPath, newFullPath);
          console.log(`${fullPath} → ${newFullPath}`);
        }
      }
    }
  }
}

// Update galleries.ts URLs
function updateGalleriesFile() {
  let content = fs.readFileSync(galleriesPath, "utf-8");

  // Simple regex to replace URLs like "/photos/.../Old Name.jpg"
  content = content.replace(/url:\s*"(.*?)"/g, (match, p1) => {
    const parts = p1.split("/");
    const filename = parts.pop();
    const folder = parts.join("/");
    const newFilename = cleanFilename(filename);
    return `url: "${folder}/${newFilename}"`;
  });

  // Update cover images similarly
  content = content.replace(/cover:\s*"(.*?)"/g, (match, p1) => {
    const parts = p1.split("/");
    const filename = parts.pop();
    const folder = parts.join("/");
    const newFilename = cleanFilename(filename);
    return `cover: "${folder}/${newFilename}"`;
  });

  fs.writeFileSync(galleriesPath, content, "utf-8");
  console.log("galleries.ts updated!");
}

// Run the script
renameFilesRecursively(photosRoot);
updateGalleriesFile();

console.log("All files renamed and galleries.ts updated.");
