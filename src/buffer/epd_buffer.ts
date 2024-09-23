const convertImageForEPD = (
  inputBuffer: Uint8Array,
  width: number,
  height: number,
) => {
  if (inputBuffer.length !== width * height) {
    throw new Error("Input buffer size does not match specified dimensions");
  }

  const outputSize = Math.ceil((width * height) / 4);
  const outputBuffer = new Uint8Array(outputSize);

  let outputIndex = 0;
  let outputByte = 0;
  let pixelCount = 0;

  for (let i = 0; i < inputBuffer.length; i++) {
    // Get grayscale value (assuming input is already grayscale)
    const grayValue = inputBuffer[i];

    // Convert to 2-bit grayscale (4 levels)
    let twoBitGray;
    if (grayValue < 64)
      twoBitGray = 0; // Black
    else if (grayValue < 128)
      twoBitGray = 1; // Dark Gray
    else if (grayValue < 192)
      twoBitGray = 2; // Light Gray
    else twoBitGray = 3; // White

    // Add to output byte
    outputByte = (outputByte << 2) | twoBitGray;
    pixelCount++;

    // If we've processed 4 pixels, store the byte
    if (pixelCount === 4) {
      outputBuffer[outputIndex] = outputByte;
      outputIndex++;
      outputByte = 0;
      pixelCount = 0;
    }
  }

  // Handle any remaining pixels
  if (pixelCount > 0) {
    outputByte <<= (4 - pixelCount) * 2; // Shift to align with MSB
    outputBuffer[outputIndex] = outputByte;
  }

  return outputBuffer;
};
