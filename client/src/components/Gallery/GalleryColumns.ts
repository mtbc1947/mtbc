import { ColumnDescriptor } from "../../components/MaintainEntityManager";
import { GalleryRecord, outFormFolderName } from "../../utilities/galleryUtils";

export function getGalleryColumns(): ColumnDescriptor<GalleryRecord>[] {
  return [
    {
      key: "folderName",
      label: "Folder Name",
      align: "center",
      optional: false,
      render: (value, item) => outFormFolderName(value || ""), // <-- display-friendly
    },
    {
      key: "title",
      label: "Title",
      align: "center",
      optional: false,
      render: (value) => value || "",
    },
    {
      key: "cover",
      label: "Cover Url",
      align: "center",
      optional: true,
      render: (value) => value || "",
    },
  ];
}
