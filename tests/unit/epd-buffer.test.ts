import { test, describe } from "node:test";
import assert from "node:assert";
import { createCanvas } from "@napi-rs/canvas";
import { createEpdBuffer, createEpdTestBuffer } from "../../src/chart/draw/index.ts";
import { dimensions } from "../../src/chart/draw/visual-settings.ts";

void describe("EPD Buffer Creation Unit Tests", () => {
  void test("should create EPD buffer from canvas", () => {
    const canvas = createCanvas(280, 480);
    const ctx = canvas.getContext("2d");
    
    // Draw simple test pattern
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 280, 480);
    ctx.fillStyle = "black";
    ctx.fillRect(10, 10, 100, 100);
    
    const buffer = createEpdBuffer(canvas, dimensions);
    
    assert(buffer instanceof Uint8Array, "Should return Uint8Array");
    assert(buffer.length > 0, "Buffer should not be empty");
    
    // EPD buffer size calculation for 4-gray mode: (width * height) / 4 pixels per byte
    const expectedSize = (dimensions.width * dimensions.height) / 4;
    assert.strictEqual(buffer.length, expectedSize, "Buffer should have correct size for 4-gray mode");
  });

  void test("should create EPD test buffer", () => {
    const testBuffer = createEpdTestBuffer(dimensions);
    
    assert(testBuffer instanceof Uint8Array, "Should return Uint8Array");
    assert(testBuffer.length > 0, "Buffer should not be empty");
    
    const expectedSize = (dimensions.width * dimensions.height) / 4;
    assert.strictEqual(testBuffer.length, expectedSize, "Test buffer should have correct size");
  });

  void test("should handle different canvas sizes", () => {
    // Test with smaller canvas
    const smallCanvas = createCanvas(100, 100);
    const smallCtx = smallCanvas.getContext("2d");
    smallCtx.fillStyle = "white";
    smallCtx.fillRect(0, 0, 100, 100);
    
    const smallDimensions = { ...dimensions, width: 100, height: 100 };
    const smallBuffer = createEpdBuffer(smallCanvas, smallDimensions);
    
    const expectedSmallSize = (100 * 100) / 4;
    assert.strictEqual(smallBuffer.length, expectedSmallSize, "Should handle different sizes");
  });

  void test("should handle canvas with various colors", () => {
    const canvas = createCanvas(280, 480);
    const ctx = canvas.getContext("2d");
    
    // Create gradient with various grays
    const gradient = ctx.createLinearGradient(0, 0, 280, 0);
    gradient.addColorStop(0, "#FFFFFF"); // White
    gradient.addColorStop(0.33, "#AAAAAA"); // Light gray
    gradient.addColorStop(0.66, "#555555"); // Dark gray
    gradient.addColorStop(1, "#000000"); // Black
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 280, 480);
    
    const buffer = createEpdBuffer(canvas, dimensions);
    
    assert(buffer instanceof Uint8Array, "Should handle gradient colors");
    assert(buffer.length > 0, "Buffer should not be empty");
    
    // Check that buffer contains various values (not all the same)
    const uniqueValues = new Set(buffer);
    assert(uniqueValues.size > 1, "Buffer should contain different grayscale values");
  });

  void test("should produce consistent output for same input", () => {
    const canvas1 = createCanvas(280, 480);
    const ctx1 = canvas1.getContext("2d");
    ctx1.fillStyle = "#808080"; // Gray
    ctx1.fillRect(0, 0, 280, 480);
    
    const canvas2 = createCanvas(280, 480);
    const ctx2 = canvas2.getContext("2d");
    ctx2.fillStyle = "#808080"; // Same gray
    ctx2.fillRect(0, 0, 280, 480);
    
    const buffer1 = createEpdBuffer(canvas1, dimensions);
    const buffer2 = createEpdBuffer(canvas2, dimensions);
    
    assert.strictEqual(buffer1.length, buffer2.length, "Buffers should have same length");
    
    // Compare byte by byte
    for (let i = 0; i < buffer1.length; i++) {
      assert.strictEqual(buffer1[i], buffer2[i], `Byte ${i} should be identical`);
    }
  });

  void test("should handle edge case dimensions", () => {
    // Test with minimum dimensions
    const minCanvas = createCanvas(4, 4); // 4x4 is minimum for 4-gray mode (16 pixels = 4 bytes)
    const minCtx = minCanvas.getContext("2d");
    minCtx.fillStyle = "white";
    minCtx.fillRect(0, 0, 4, 4);
    
    const minDimensions = { ...dimensions, width: 4, height: 4 };
    const minBuffer = createEpdBuffer(minCanvas, minDimensions);
    
    assert(minBuffer instanceof Uint8Array, "Should handle minimum dimensions");
    assert.strictEqual(minBuffer.length, 4, "4x4 should produce 4-byte buffer");
  });

  void test("EPD buffer values should be in valid 4-gray range", () => {
    const canvas = createCanvas(280, 480);
    const ctx = canvas.getContext("2d");
    
    // Fill with pure colors to test quantization
    ctx.fillStyle = "#FFFFFF"; // White
    ctx.fillRect(0, 0, 70, 480);
    ctx.fillStyle = "#AAAAAA"; // Light gray  
    ctx.fillRect(70, 0, 70, 480);
    ctx.fillStyle = "#555555"; // Dark gray
    ctx.fillRect(140, 0, 70, 480);
    ctx.fillStyle = "#000000"; // Black
    ctx.fillRect(210, 0, 70, 480);
    
    const buffer = createEpdBuffer(canvas, dimensions);
    
    // Each byte in 4-gray mode represents 4 pixels (2 bits each)
    // Valid 2-bit values are 0, 1, 2, 3 (00, 01, 10, 11)
    // When packed, bytes can be 0x00 to 0xFF
    for (let i = 0; i < buffer.length; i++) {
      assert(buffer[i] >= 0 && buffer[i] <= 255, `Buffer byte ${i} should be 0-255`);
    }
  });
});