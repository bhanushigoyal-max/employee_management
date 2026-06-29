import { getFileUrl } from '../../src/utils/fileUtils';

describe('fileUtils - getFileUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn();
  });

  it('should return empty string if no filePath provided', () => {
    expect(getFileUrl(null)).toBe('');
    expect(getFileUrl(undefined)).toBe('');
    expect(getFileUrl('')).toBe('');
  });

  it('should return filePath as is if it starts with http', () => {
    expect(getFileUrl('http://example.com/image.png')).toBe('http://example.com/image.png');
    expect(getFileUrl('https://example.com/image.png')).toBe('https://example.com/image.png');
  });

  it('should return filePath as is if it starts with blob:', () => {
    expect(getFileUrl('blob:http://localhost:5000/123')).toBe('blob:http://localhost:5000/123');
  });

  it('should return filePath as is if it starts with data:', () => {
    expect(getFileUrl('data:image/png;base64,123')).toBe('data:image/png;base64,123');
  });

  it('should construct URL with localhost:5000 if VITE_API_BASE_URL is not set', () => {
    delete process.env.VITE_API_BASE_URL;
    const filePath = 'C:\\uploads\\image.png';
    expect(getFileUrl(filePath)).toBe('http://localhost:5000/uploads/image.png');
  });

  it('should construct URL with VITE_API_BASE_URL if set', () => {
    process.env.VITE_API_BASE_URL = 'http://example.com/api';
    const filePath = '/var/www/uploads/test.jpg';
    expect(getFileUrl(filePath)).toBe('http://example.com/uploads/test.jpg');
  });

  it('should use createObjectURL for File/Blob objects', () => {
    const mockFile = new File([''], 'test.png', { type: 'image/png' });
    (globalThis.URL.createObjectURL as jest.Mock).mockReturnValueOnce('blob:mock-url');
    expect(getFileUrl(mockFile)).toBe('blob:mock-url');
  });

  it('should return empty string if createObjectURL throws an error', () => {
    const mockFile = { invalid: 'object' };
    (globalThis.URL.createObjectURL as jest.Mock).mockImplementationOnce(() => { throw new Error('Invalid'); });
    expect(getFileUrl(mockFile as any)).toBe('');
  });
});
