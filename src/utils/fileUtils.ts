export const getFileUrl = (filePath: string | any) => {
  if (!filePath) return '';
  if (typeof filePath === 'string') {
    // If it's already a web URL, return as is
    if (filePath.startsWith('http') || filePath.startsWith('blob:') || filePath.startsWith('data:')) {
      return filePath;
    }

    // Extract filename from absolute path 
    const filename = filePath.split(/[\\/]/).pop();

    // Check environment variable or fallback to localhost:5000
    const baseUrl = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
      : 'http://localhost:5000';

    return `${baseUrl}/uploads/${filename}`;
  }

  try {
    return URL.createObjectURL(filePath);
  } catch (e) {
    return '';
  }
};
