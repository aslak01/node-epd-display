/**
 * Converts an RGB image buffer to grayscale.
 * @param {Uint8Array} rgbBuffer - The input RGB buffer
 * @param {number} width - The width of the image
 * @param {number} height - The height of the image
 * @returns {Uint8Array} The grayscale buffer
 */

function convertToGrayscale(
  rgbBuffer: Uint8Array,
  width: number,
  height: number,
): Uint8Array {
  if (rgbBuffer.length !== width * height * 3) {
    throw new Error(
      "Buffer size does not match the specified dimensions for an RGB image",
    );
  }

  const grayscaleBuffer = new Uint8Array(width * height);

  for (let i = 0, j = 0; i < rgbBuffer.length; i += 3, j++) {
    const r = rgbBuffer[i];
    const g = rgbBuffer[i + 1];
    const b = rgbBuffer[i + 2];

    // Convert to grayscale using luminosity method
    // The coefficients (0.299, 0.587, 0.114) are based on human perception of color
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

    grayscaleBuffer[j] = gray;
  }

  return grayscaleBuffer;
}

// Usage example:
// const width = 280;
// const height = 480;
// const rgbBuffer = new Uint8Array(width * height * 3); // Your RGB image data
// Fill rgbBuffer with your image data...

// const grayscaleBuffer = convertToGrayscale(rgbBuffer, width, height);

// You can now use grayscaleBuffer with the EPD conversion function
// const epdBuffer = convertImageForEPD(grayscaleBuffer, width, height);
// epd.EPD_3IN7_4Gray_Display(Buffer.from(epdBuffer));
