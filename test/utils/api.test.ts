import { api } from '../../src/utils/api';
import { agent, multiagent } from '../../src/utils/axiosConfig';

jest.mock('../../src/utils/axiosConfig', () => ({
  agent: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  multiagent: {
    post: jest.fn(),
    put: jest.fn(),
  }
}));

describe('api utility', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call agent.get with correct url and params', () => {
    api.get('/test', { id: 1 });
    expect(agent.get).toHaveBeenCalledWith('/test', { params: { id: 1 } });
  });

  it('should call agent.post for non-multipart data', () => {
    const data = { name: 'Test' };
    api.post('/test', data);
    expect(agent.post).toHaveBeenCalledWith('/test', data);
    expect(multiagent.post).not.toHaveBeenCalled();
  });

  it('should call multiagent.post for multipart data', () => {
    const data = new FormData();
    data.append('file', 'test');
    api.post('/test', data, true);
    expect(multiagent.post).toHaveBeenCalledWith('/test', data);
    expect(agent.post).not.toHaveBeenCalled();
  });

  it('should call agent.put for non-multipart data', () => {
    const data = { name: 'Test' };
    api.put('/test', data);
    expect(agent.put).toHaveBeenCalledWith('/test', data);
    expect(multiagent.put).not.toHaveBeenCalled();
  });

  it('should call multiagent.put for multipart data', () => {
    const data = new FormData();
    data.append('file', 'test');
    api.put('/test', data, true);
    expect(multiagent.put).toHaveBeenCalledWith('/test', data);
    expect(agent.put).not.toHaveBeenCalled();
  });

  it('should call agent.delete', () => {
    api.delete('/test');
    expect(agent.delete).toHaveBeenCalledWith('/test');
  });
});
