import http from '../../services/httpService';
import { State as UIState } from './ui.index';

const apiEndpoint = '/settings';

export const getSettings = async (isMobile: boolean) => {
  let url = `${apiEndpoint}`;
  return await http.get(`${url}?isMobile=${isMobile}`);
};

export const updateSettings = async (data: Partial<UIState>) => {
  let url = `${apiEndpoint}`;
  return await http.patch(`${url}`, { ...data });
};
