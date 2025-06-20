import axios from "axios";

export async function getImages(folderPath) {
    const IK_PRIVATE_KEY = process.env.IK_PRIVATE_KEY;

    const url = "https://api.imagekit.io/v1/files";

    const auth = Buffer.from(`${IK_PRIVATE_KEY}:`).toString("base64");

    const response = await axios.get(url, {
        headers: {
            Authorization: `Basic ${auth}`,
        },
        params: {
            path: folderPath, // 👈 dynamic path
            limit: 50,
        },
    });

    return response.data.map((file) => ({
        id: file.fileId,
        url: file.url,
        name: file.name,
    }));
}
