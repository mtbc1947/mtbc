// utilities/galleryUtils.ts
import { GalleryImage, Photo } from "../types/galleryTypes";

export interface GalleryRecord {
    _id?: string;
    title: string;
    folderName: string;
    cover?: string;
    description?: string;
    photos?:string[];
}

export interface UploadImageResult {
  success: boolean;           // true if upload succeeded
  message: string;            // backend message, e.g. "File uploaded successfully"
  url?: string;               // uploaded file URL
  thumbnailUrl?: string;      // thumbnail URL from ImageKit
  fileId?: string;            // ImageKit file ID
}

export const inFormFolderName = (folder: string): string => {
    // this routine takes in the folder name from the client screen and transforms the foldername into a form suitable for 
    // ImageKit and for storing in the database. SPaces becomes underscore, all converted to lower case.
    if (!folder) return "";
    return folder.trim().replace(/\s+/g, "_").toLowerCase();
}
  
export const outFormFolderName = (folder: string): string => {
    // this routine takes in the folder name from the database and transforms the foldername into a form suitable for 
    // displaying. Underscoe is turned into space, the words are capitalised.
    if (!folder) return "";
    return folder
        .replace(/_/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Fetches all gallery records from the backend.
 */
export const getAllGallery = async (): Promise<GalleryRecord[]> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/gallery/`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        return res.ok ? (data as GalleryRecord[]) : [];
    } catch (err) {
        throw new Error(`getAllGallery error: ${err}`);
    }
};

export const createGallery = async (
    item: GalleryRecord
): Promise<GalleryRecord> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/gallery`;
    console.log("util/createGallery");

    const payload: GalleryRecord = {
        ...item,
        cover: item.cover && item.cover.trim() !== "" 
            ? item.cover 
            : "/assets/green1.jpg"
    };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to create gallery: ${errorText}`);
        }

        return await res.json();
    } catch (err) {
        throw new Error(`createGallery error: ${err}`);
    }
};

export const updateGallery = async (
    gallery: GalleryRecord
): Promise<GalleryRecord> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/gallery/${
        gallery._id
    }`;
    const {_id, ...data} = gallery;
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to update gallery: ${errorText}`);
        }
        return await res.json();
    } catch (err) {
        throw new Error(`updateGallery error: ${err}`);
    }
};

export const updateAllGallery = async (
    updatedRecords: GalleryRecord[]
): Promise<void> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/gallery/updateMany`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedRecords),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to update all gallery: ${errorText}`);
        }
    } catch (err) {
        throw new Error(`updateAllGallery error: ${err}`);
    }
};

/**
 * Deletes a gallery record by its refKey.
 */
export const deleteGallery = async (gallery: GalleryRecord): Promise<void> => {
    console.log("utility delete Gallery");
    if (!gallery._id) throw new Error("Gallery._id is required for deletion.");

    const url = `${import.meta.env.VITE_BACKEND_URL}/gallery/${gallery._id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to delete gallery: ${errorText}`);
        }
    } catch (err) {
        throw new Error(`deleteGallery error: ${err}`);
    }
};
// Need to add folder name
export async function importFile(file: File, folderName: string): Promise<UploadImageResult> {

    const url = `${import.meta.env.VITE_BACKEND_URL}/gallery/import`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", folderName);

    let response: Response;
    let data: any;

    try {
        response = await fetch(url, {
            method: "POST",
            body: formData,
        });
        data = await response.json();
        console.log("Utiel");
        console.log(data);
   } catch (err) {
        console.error("Network or JSON parsing error", err);
        throw new Error("Failed to communicate with server");
    }

    if (!response.ok) {
        const error = new Error(data?.message || "Upload file failed");
        throw error;
    }

    return {
        success: true,
        message: data.message,
        url: data.url,
        thumbnailUrl: data.thumbnailUrl,
        fileId: data.fileId,
    };
}

export const getGalleryImages = async (folderName: string): Promise<GalleryImage[]> => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/gallery/images/${encodeURIComponent(folderName)}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`Failed to fetch gallery [${folderName}] images: ${res.statusText}`);
        const data = await res.json();
        const images = (data as any[])
        .filter((f) => f.fileType === "image")
        .map((f) => ({
            url: f.url,
            fileId: f.fileId,
            filename: f.filename,
            thumbnail: f.thumbnail,
        }));
        return images; // may be []
    } catch (err) {
        console.error(err);
        return [];
    }
};

/**
 * Requests backend to delete a photo from ImageKit.
 * Expects the backend to handle deletion via ImageKit API.
 */

export const deletePhotoFromImageKit = async (photo: GalleryImage): Promise<void> => {
  console.log("deletePhotoFromImageKit");

  // We expect `photo.name` to contain the ImageKit fileId
  if (!photo.fileId) throw new Error("Photo fileId (name) is required to delete a photo.");

  const url = `${import.meta.env.VITE_BACKEND_URL}/image/${encodeURIComponent(photo.fileId)}`;

  try {
    const res = await fetch(url, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to delete photo: ${errorText}`);
    }
  } catch (err) {
    throw new Error(`deletePhotoFromImageKit error: ${err}`);
  }
};
// utilities/galleryUtils.ts
export const mapGalleryImageToPhoto = (image: GalleryImage, folder?: string): Photo => {
  const fileId = image.fileId || image.url; // fallback if no fileId
  const url = image.url;
  const thumbnail = image.url.includes("ik.imagekit.io")
    ? `${image.url}?tr=w-300,h-300,fo-center` // auto square thumbnail
    : image.url;

  return {
    fileId,
    url,
    filename: image.filename,
    folder,
    thumbnail,
  };
};


