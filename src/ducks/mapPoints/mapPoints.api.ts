import http from '../../services/httpService';

const apiEndpoint = '/map-points';

export const getMapPoints = async (filterBool: boolean, vid: string, km: number) => {
  let url = `${apiEndpoint}`;
  if (filterBool) return await http.get(`${url}/distance/?km=${km}&vehicle=${vid}`);
  return await http.get(`${url}/?vehicle=${vid}&sortBy=dataPoints.0:desc`);
};
