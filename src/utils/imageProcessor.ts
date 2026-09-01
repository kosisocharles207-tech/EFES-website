/**
 * EFES Hall of Fame Image Processing and Optimization Utility
 * Handles client-side file reading, auto-cropping, resizing, and compression
 * for JPG, PNG, WEBP, HEIC, and mobile gallery photos.
 */

export interface ProcessImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/webp' | 'image/png';
  cropSquare?: boolean;
}

export const DEFAULT_AVATARS = [
  {
    name: 'Michael (Titan)',
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Amigty (Conqueror)',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Juven (Virtuoso)',
    url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kosi (General)',
    url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'GT Baddest (Enforcer)',
    url: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'TMF (Magician)',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Golden Champion (Star)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Striker King',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
  },
];

/**
 * Validates whether the given file is an acceptable image format
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const isImageType = file.type && file.type.toLowerCase().startsWith('image/');
  const hasImageExtension = file.name && /\.(jpe?g|png|webp|heic|heif|avif|gif|bmp|svg)$/i.test(file.name);

  if (!isImageType && !hasImageExtension) {
    return {
      valid: false,
      error: 'Please select a valid image photo (JPG, PNG, WEBP, or Camera photo).',
    };
  }

  // Max 25MB file size limit for raw upload before compression
  const maxSize = 25 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Photo is too large (max 25MB). Please choose a smaller photo.',
    };
  }

  return { valid: true };
}

/**
 * Reads a File or Blob, automatically centers, crops to square, and resizes to optimal dimension.
 * Uses createImageBitmap if available for auto-orientation, falling back to Image element.
 */
export async function processAndOptimizeImage(
  file: File | Blob,
  options: ProcessImageOptions = {}
): Promise<{
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  optimizedSize: number;
}> {
  const {
    maxWidth = 480,
    maxHeight = 480,
    quality = 0.84,
    format = 'image/webp',
    cropSquare = true,
  } = options;

  const originalSize = file.size;

  // Helper to draw and compress from any drawable source (ImageBitmap or HTMLImageElement)
  const drawAndCompress = (
    imgSource: CanvasImageSource,
    srcWidth: number,
    srcHeight: number
  ) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get 2D canvas context');
    }

    let srcX = 0;
    let srcY = 0;
    let cropW = srcWidth;
    let cropH = srcHeight;

    let targetWidth = maxWidth;
    let targetHeight = maxHeight;

    if (cropSquare) {
      // Calculate center square crop
      const minDim = Math.min(srcWidth, srcHeight);
      srcX = (srcWidth - minDim) / 2;
      srcY = (srcHeight - minDim) / 2;
      cropW = minDim;
      cropH = minDim;
      targetWidth = Math.min(maxWidth, minDim);
      targetHeight = targetWidth;
    } else {
      // Preserve aspect ratio
      let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      if (ratio > 1) ratio = 1; // Don't upscale
      targetWidth = Math.round(srcWidth * ratio);
      targetHeight = Math.round(srcHeight * ratio);
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // High quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw cropped & resized image
    ctx.drawImage(
      imgSource,
      srcX,
      srcY,
      cropW,
      cropH,
      0,
      0,
      targetWidth,
      targetHeight
    );

    // Convert to dataUrl (fallback to image/jpeg if webp not supported)
    let outputFormat = format;
    let dataUrl = canvas.toDataURL(outputFormat, quality);

    if (format === 'image/webp' && !dataUrl.startsWith('data:image/webp')) {
      outputFormat = 'image/jpeg';
      dataUrl = canvas.toDataURL(outputFormat, quality);
    }

    const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
    const optimizedSize = Math.round(base64Length * 0.75);

    return {
      dataUrl,
      width: targetWidth,
      height: targetHeight,
      originalSize,
      optimizedSize,
    };
  };

  // Method 1: Try createImageBitmap (handles EXIF orientation automatically in modern browsers)
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      const result = drawAndCompress(bitmap, bitmap.width, bitmap.height);
      bitmap.close();
      return result;
    } catch {
      // Fallback to FileReader + HTMLImageElement below
    }
  }

  // Method 2: FileReader + Image element fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        try {
          const result = drawAndCompress(img, img.naturalWidth || img.width, img.naturalHeight || img.height);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error('Failed to decode image file. Please try another image.'));
      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read image file from device.'));
    reader.readAsDataURL(file);
  });
}
