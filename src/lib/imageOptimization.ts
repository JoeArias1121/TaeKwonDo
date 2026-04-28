import imageCompression from 'browser-image-compression';

/**
 * Optimizes an image file for upload to Firebase Storage.
 * Compresses the image to WebP format, limits size to 500KB, 
 * and caps dimensions at 1920px.
 * 
 * @param file The original image File object from an input
 * @returns A compressed Blob/File object in WebP format
 */
export async function optimizeImage(file: File): Promise<File | Blob> {
  const options = {
    maxSizeMB: 0.5,           // 500KB limit
    maxWidthOrHeight: 1920,   // Standard HD cap
    useWebWorker: true,
    fileType: 'image/webp'    // Forces WebP format
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    // browser-image-compression returns a Blob that can be used as a File
    return compressedBlob;
  } catch (error) {
    console.error("Compression Error:", error);
    return file; // Fallback to original if compression fails
  }
}
