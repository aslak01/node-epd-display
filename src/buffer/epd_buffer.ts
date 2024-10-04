export function convertImageForEPD(
  input: Buffer,
  dims: { width: number; height: number },
) {
  const inputBuffer = new Uint8Array(input);
  const { width, height } = dims;
  console.log("input length", input.length);
  console.log("pixel dimensions", width, height, width * height);
  console.log("input buffer length", inputBuffer.length);

  // Check if the input is already in the 4-bit grayscale format
  if (inputBuffer.length === Math.ceil((width * height) / 2)) {
    console.log("Input appears to be in 4-bit grayscale format already");
    return inputBuffer;
  }

  // If not, assume it's 8-bit grayscale and convert to 4-bit
  if (inputBuffer.length !== width * height) {
    throw new Error(
      "Input buffer size does not match specified dimensions for 8-bit grayscale",
    );
  }

  const outputSize = Math.ceil((width * height) / 2); // 4 bits per pixel
  const outputBuffer = new Uint8Array(outputSize);

  for (let i = 0; i < inputBuffer.length; i += 2) {
    const pixel1 = inputBuffer[i] >> 4; // Convert 8-bit to 4-bit
    const pixel2 = inputBuffer[i + 1] >> 4;
    outputBuffer[i / 2] = (pixel1 << 4) | pixel2;
  }

  return outputBuffer;
}
