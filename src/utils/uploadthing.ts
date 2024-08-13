import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteFileFromUploadThing(fileUrl: string) {
  try {
    const fileKey = fileUrl.split("/").pop();
    if (!fileKey) throw new Error("Invalid file URL");
    await utapi.deleteFiles(fileKey);
  } catch (error) {
    console.error("Error deleting file from UploadThing:", error);
    throw error;
  }
}
