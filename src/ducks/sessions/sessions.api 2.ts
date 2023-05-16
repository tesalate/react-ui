import http from '../../services/httpService';
import { SessionQuery } from './sessions.index';

const apiEndpoint = '/sessions';

export const getLogs = async (payload: { vehicle: any; startDate: any; endDate: any }) => {
  const { vehicle, startDate, endDate } = payload;
  let url = `${apiEndpoint}/logs?vehicle=${vehicle}&startDate=${startDate}&endDate=${endDate}`;
  const response = await http.get(url);

  return response;
};

export const getSessions = async (query: SessionQuery) => {
  const { id, sortBy, type, ...rest } = query;
  let url = `${apiEndpoint}`;
  if (id) url += `/${id}`;
  const searchParams = new URLSearchParams({ sortBy: sortBy || '_id:desc', ...rest });
  const response = await http.get(`${url}?type=${type}&${searchParams.toString()}`);
  return response;
};

export const getSessionById = async ({ id }: { id: string }) => {
  let url = `${apiEndpoint}`;
  const response = await http.get(`${url}/${id}`);
  return response;
};
