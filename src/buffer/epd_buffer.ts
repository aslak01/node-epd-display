export function convertImageForEPD(
  input: Buffer,
  dims: { width: number; height: number },
): Uint8Array {
  const { width, height } = dims;
  const expectedSize8Bit = width * height;
  const expectedSize4Bit = Math.ceil((width * height) / 2);

  console.log("Input buffer length:", input.length);
  console.log("Expected 8-bit size:", expectedSize8Bit);
  console.log("Expected 4-bit size:", expectedSize4Bit);

  if (input.length === expectedSize4Bit) {
    console.log("Input appears to be in 4-bit grayscale format already");
    return new Uint8Array(input);
  }

  if (input.length === expectedSize8Bit) {
    console.log("Converting from 8-bit to 4-bit grayscale");
    const outputBuffer = new Uint8Array(expectedSize4Bit);
    for (let i = 0; i < input.length; i += 2) {
      const pixel1 = input[i] >> 4; // Convert 8-bit to 4-bit
      const pixel2 = input[i + 1] >> 4;
      outputBuffer[i / 2] = (pixel1 << 4) | pixel2;
    }
    return outputBuffer;
  }

  console.log(
    "Input size doesn't match expected 8-bit or 4-bit grayscale size",
  );

  if (input.length === expectedSize8Bit * 4) {
    console.log("Input appears to be RGBA. Converting to 4-bit grayscale");
    const outputBuffer = new Uint8Array(expectedSize4Bit);
    for (let i = 0, j = 0; i < input.length; i += 8, j++) {
      const pixel1 =
        Math.round(
          0.299 * input[i] + 0.587 * input[i + 1] + 0.114 * input[i + 2],
        ) >> 4;
      const pixel2 =
        Math.round(
          0.299 * input[i + 4] + 0.587 * input[i + 5] + 0.114 * input[i + 6],
        ) >> 4;
      outputBuffer[j] = (pixel1 << 4) | pixel2;
    }
    return outputBuffer;
  }

  throw new Error(
    `Unexpected input buffer size: ${input.length}. Cannot convert to EPD format.`,
  );
}
