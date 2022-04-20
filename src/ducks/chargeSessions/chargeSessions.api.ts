import http from '../../services/httpService';

const apiEndpoint = '/charge-sessions';
export interface chargeSessionQuery {
  vehicle: string;
  id?: string;
  sortBy: string;
  limit: string;
  page: string;
}
export const getPaginatedChargeData = async (vid: string, skip: number, limit: number) => {
  let url = `${apiEndpoint}/getPaginatedChargeData?vid=${vid}&skip=${skip}&limit=${limit}`;
  const response = await http.get(url);
  return response;
};

export const getChargeData = async (query: chargeSessionQuery) => {
  const { id, sortBy, ...rest } = query;
  let url = `${apiEndpoint}`;
  if (id) url += `/${id}`;
  const searchParams = new URLSearchParams({ sortBy: sortBy || '$natural:desc', ...rest });
  const response = await http.get(`${url}?${searchParams.toString()}`);
  return response;
};

export const getChargeDataById = async ({ id }: { id: string }) => {
  let url = `${apiEndpoint}`;
  const response = await http.get(`${url}/${id}`);
  return response;
};
