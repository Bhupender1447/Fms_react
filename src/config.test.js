import { resolveApiUrl } from './config';

test.each([
  [undefined, 'development', 'localhost', 'http://localhost:8080/'],
  [undefined, 'development', '127.0.0.1', 'http://127.0.0.1:8080/'],
  [undefined, 'production', 'localhost', 'https://isovia.ca/fms_api/'],
  ['http://127.0.0.1:8080/', 'development', 'localhost', 'http://localhost:8080/'],
  ['https://example.test/api/', 'development', 'localhost', 'https://example.test/api/'],
  ['/api/', 'development', 'localhost', '/api/'],
])('API target respects explicit configuration and local sessions', (configured, mode, host, expected) => {
  expect(resolveApiUrl(configured, mode, host)).toBe(expected);
});
