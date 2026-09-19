// Medicine Package Photo validation & compression helper

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  dataUrl?: string;
}

const MAX_FILE_SIZE_BYTES = 6 * 1024 * 1024; // 6MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export async function processMedicinePhoto(file: File): Promise<ImageValidationResult> {
  if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPG, JPEG, or PNG photo of the medicine strip.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'File size exceeds 6MB. Please select a smaller photo.',
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Optimize dimensions while keeping text crisp
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ valid: true, dataUrl: e.target?.result as string });
          return;
        }

        // Draw with high smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        resolve({
          valid: true,
          dataUrl: compressedDataUrl,
        });
      };

      img.onerror = () => {
        resolve({
          valid: false,
          error: 'Unable to process image. Please try another photo.',
        });
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve({
        valid: false,
        error: 'Failed to read file from your device.',
      });
    };

    reader.readAsDataURL(file);
  });
}
