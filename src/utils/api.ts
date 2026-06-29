import { agent, multiagent } from './axiosConfig';

export const api = {
  get: (url: string, params?: any) => agent.get(url, { params }),
  post: (url: string, data: any, isMultipart = false) => 
    isMultipart ? multiagent.post(url, data) : agent.post(url, data),
  put: (url: string, data: any, isMultipart = false) => 
    isMultipart ? multiagent.put(url, data) : agent.put(url, data),
  delete: (url: string) => agent.delete(url),
};
