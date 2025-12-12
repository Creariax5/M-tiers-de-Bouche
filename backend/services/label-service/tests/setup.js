// Setup file for Jest
// Mock console.log to keep output clean
global.console = {
  ...console,
  // log: jest.fn(),
  // error: jest.fn(),
};
