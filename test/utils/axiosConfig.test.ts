import { agent, multiagent } from '../../src/utils/axiosConfig';

describe('axiosConfig', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockClear();
    jest.spyOn(Storage.prototype, 'setItem').mockClear();
    jest.spyOn(Storage.prototype, 'removeItem').mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('agent', () => {
    it('should have correct default headers', () => {
      expect(agent.defaults.headers['Content-Type']).toBe('application/json');
      expect(agent.defaults.headers['Accept']).toBe('application/json');
    });

    it('request interceptor should attach token if available', async () => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('mock-token');
      const handlers = (agent.interceptors.request as any).handlers;
      const config = await handlers[0].fulfilled({ headers: {} as any });
      expect(config.headers.Authorization).toBe('Bearer mock-token');
      expect(config.headers['X-Env']).toBe('default-sim-value');
    });

    it('request interceptor should handle FormData content type', async () => {
      const formData = new FormData();
      const handlers = (agent.interceptors.request as any).handlers;
      const config = await handlers[0].fulfilled({ headers: {} as any, data: formData });
      expect(config.headers['Content-Type']).toBe('multipart/form-data');
    });

    it('response interceptor should handle 401 error and redirect', async () => {
      const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
      const error = {
        response: { status: 401, data: { message: 'Unauthenticated.' } }
      };
      
      const handlers = (agent.interceptors.response as any).handlers;
      try {
        await handlers[0].rejected(error);
      } catch (e) {
        expect(e).toEqual({ message: 'Unauthenticated.' });
      }
      
      expect(removeItemSpy).toHaveBeenCalledWith('persist:root');
      expect(removeItemSpy).toHaveBeenCalledWith('authToken');
    });
  });

  describe('multiagent', () => {
    it('should have correct default headers', () => {
      expect(multiagent.defaults.headers['Content-Type']).toBe('multipart/form-data');
    });

    it('request interceptor should attach token if available', async () => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('mock-token');
      const handlers = (multiagent.interceptors.request as any).handlers;
      const config = await handlers[0].fulfilled({ headers: {} as any });
      expect(config.headers.Authorization).toBe('Bearer mock-token');
    });

    it('response interceptor should handle 401 error and redirect', async () => {
      const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
      const error = {
        response: { status: 401, data: { message: 'Unauthenticated.' } }
      };
      
      const handlers = (multiagent.interceptors.response as any).handlers;
      try {
        await handlers[0].rejected(error);
      } catch (e) {
        expect(e).toEqual({ message: 'Unauthenticated.' });
      }
      
      expect(removeItemSpy).toHaveBeenCalledWith('persist:root');
      expect(removeItemSpy).toHaveBeenCalledWith('authToken');
    });
  });
});
