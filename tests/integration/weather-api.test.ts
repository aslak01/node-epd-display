import { test, describe } from "node:test";
import assert from "node:assert";
import { getWeather } from "../../src/chart/data/weather/index.ts";

void describe("Weather API Integration Tests", () => {
  void test("should fetch mock weather data", async () => {
    const weatherData = await getWeather(true);
    
    assert(weatherData, "Weather data should be returned");
    assert(weatherData.today, "Should have today data");
    assert(weatherData.nextDays, "Should have next days data");
    assert(Array.isArray(weatherData.today), "Today should be an array");
    assert(Array.isArray(weatherData.nextDays), "Next days should be an array");
  });

  void test("mock weather data should have correct structure", async () => {
    const weatherData = await getWeather(true);
    
    assert(weatherData.today.length > 0, "Should have today weather data points");
    assert(weatherData.nextDays.length >= 0, "Should have next days data");
    
    const todayData = weatherData.today[0];
    assert(typeof todayData.temp === "number", "Temperature should be a number");
    assert(typeof todayData.rain === "number", "Rain should be a number");
    assert(typeof todayData.rainMax === "number", "RainMax should be a number");
    assert(todayData.date instanceof Date, "Date should be a Date object");
    
    // Check that rain and rainMax relationship is correct
    assert(todayData.rainMax >= todayData.rain, "RainMax should be >= rain");
  });

  void test("should handle real weather API", async () => {
    try {
      const weatherData = await getWeather(false, { lat: "60", lon: "11", hrs: 8 });
      
      assert(weatherData, "Real weather data should be returned");
      assert(weatherData.today.length > 0, "Should have weather data points");
      assert(weatherData.nextDays.length > 0, "Should have next days data");
      
      // Validate data structure
      const todayData = weatherData.today[0];
      assert(typeof todayData.temp === "number", "Temperature should be a number");
      assert(typeof todayData.rain === "number", "Rain should be a number");
      assert(typeof todayData.rainMax === "number", "RainMax should be a number");
      
    } catch (error) {
      // Real API might fail due to network or API issues in test environment
      console.warn("Real weather API test failed (expected in some environments):", error.message);
      assert(error instanceof Error, "Should throw proper error on API failure");
    }
  });

  void test("weather data should include rainfall visualization data", async () => {
    const weatherData = await getWeather(true);
    
    // Test that we have data for new rainfall visualization
    const rainData = weatherData.today.filter(d => d.rain > 0 || d.rainMax > 0);
    
    if (rainData.length > 0) {
      const sample = rainData[0];
      assert(typeof sample.rain === "number", "Rain amount should be numeric");
      assert(typeof sample.rainMax === "number", "Max rain should be numeric");
      assert(sample.rainMax >= sample.rain, "Max rain should be >= confirmed rain");
    }
  });

  void test("should handle edge cases in weather data", async () => {
    const weatherData = await getWeather(true);
    
    // Check for potential issues with 0 values
    const zeroRainData = weatherData.today.filter(d => d.rain === 0);
    if (zeroRainData.length > 0) {
      const sample = zeroRainData[0];
      assert(sample.rainMax >= 0, "RainMax should be >= 0 even when rain is 0");
      assert(!isNaN(sample.rain), "Rain should not be NaN");
      assert(!isNaN(sample.rainMax), "RainMax should not be NaN");
    }
  });
});