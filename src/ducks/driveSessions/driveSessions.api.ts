import http from '../../services/httpService';

const apiEndpoint = '/drive-sessions';

export interface driveSessionQuery {
  vehicle: string;
  id?: string;
  sortBy: string;
  limit: string;
  page: string;
}

export const getDriveData = async (query: driveSessionQuery) => {
  const { id, sortBy, ...rest } = query;
  let url = `${apiEndpoint}`;
  if (id) url += `/${id}`;
  const searchParams = new URLSearchParams({ sortBy: sortBy || '$natural:desc', ...rest });
  const response = await http.get(`${url}?${searchParams.toString()}`);
  return response;
};

export const getDriveDataById = async ({ id }: { id: string }) => {
  let url = `${apiEndpoint}`;
  const response = await http.get(`${url}/${id}`);
  return response;
};
