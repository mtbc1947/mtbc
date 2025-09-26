import React, { useState, useEffect } from "react";
import {
  GalleryRecord,
  inFormFolderName,
  outFormFolderName,
} from "../../utilities/galleryUtils";

interface GalleryEditFormAreaProps {
  item: GalleryRecord;
  setItem: (item: GalleryRecord) => void;
  isNew: boolean;
}

const GalleryEditFormArea: React.FC<GalleryEditFormAreaProps> = ({
  item,
  setItem,
  isNew,
}) => {
  const [displayFolderName, setDisplayFolderName] = useState(
    outFormFolderName(item.folderName)
  );

  // Keep displayFolderName in sync if item changes from outside
  useEffect(() => {
    setDisplayFolderName(outFormFolderName(item.folderName));
  }, [item.folderName]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "folderName") {
      setDisplayFolderName(value);
      setItem({
        ...item,
        folderName: inFormFolderName(value),
      });
    } else {
      setItem({
        ...item,
        [name]: value,
      });
    }
  };

  const coverUrl =
    item.cover && item.cover.trim() !== ""
      ? item.cover
      : "/assets/green1.jpg";

  return (
    <form
      id="edit-form"
      className="bg-white shadow-md rounded p-4 my-4 space-y-4"
      onSubmit={(e) => e.preventDefault()} // prevent Enter from submitting
    >
      <h2 className="text-xl font-semibold">
        {isNew ? "Create Gallery" : "Edit Gallery"}
      </h2>

      {/* Folder Name */}
      <label className="flex flex-col">
        Folder Name:
        <input
          type="text"
          name="folderName"
          value={displayFolderName}
          onChange={handleChange}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </label>

      {/* Title */}
      <label className="flex flex-col">
        Title:
        <input
          type="text"
          name="title"
          value={item.title}
          onChange={handleChange}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </label>

      {/* Cover Thumbnail */}
      {coverUrl && (
        <div className="flex flex-col items-start">
          <span className="font-medium mb-1">Cover Preview:</span>
          <img
            src={coverUrl}
            alt="Gallery cover"
            className="w-32 h-32 object-cover border rounded"
          />
        </div>
      )}

      {/* Description */}
      <label className="flex flex-col">
        Description:
        <textarea
          name="description"
          value={item.description ?? ""}
          onChange={handleChange}
          rows={4}
          placeholder="Enter a description of this gallery"
          className="border border-gray-300 rounded px-2 py-1 resize-y"
        />
      </label>
    </form>
  );
};

export default GalleryEditFormArea;
