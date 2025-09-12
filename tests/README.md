# Integration Tests

This directory contains integration and unit tests for the node-epd-display project.

## Test Structure

- `integration/` - End-to-end tests that verify complete workflows
- `unit/` - Unit tests for individual components and functions

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Test Categories

### Integration Tests

- **Chart Generation** (`chart-generation.test.ts`): Tests complete chart rendering pipeline
- **Weather API** (`weather-api.test.ts`): Tests weather data fetching and processing
- **Transit API** (`transit-api.test.ts`): Tests transit data fetching and departure handling
- **Server** (`server.test.ts`): Tests server components and EPD integration

### Unit Tests

- **Rain Visualization** (`rain-visualization.test.ts`): Tests the new rainfall visualization with diagonal lines
- **Transit Parsing** (`transit-parsing.test.ts`): Tests transit data parsing and edge cases (including 0-minute departures)
- **EPD Buffer** (`epd-buffer.test.ts`): Tests EPD display buffer creation and 4-gray conversion

## Key Test Coverage

- ✅ Mock and real data handling
- ✅ API error handling
- ✅ Edge cases (0 minutes, null values, extreme values)
- ✅ Buffer creation for EPD display
- ✅ Rainfall visualization (confirmed vs potential rain)
- ✅ Transit delay classification
- ✅ Chart generation with proper dimensions
- ✅ Cross-platform compatibility (EPD driver availability)

## Notes

- Real API tests may fail in environments without network access
- EPD-specific tests will show unavailable status on non-ARM64 Linux platforms
- Tests use Node.js built-in test runner (requires Node.js 18+)