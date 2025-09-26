import { Document, Types} from "mongoose";

export interface GalleryDocument extends Document {
    _id: Types.ObjectId;
    folderName: string;
    title: string;
    cover: string;
    description: string;
}
