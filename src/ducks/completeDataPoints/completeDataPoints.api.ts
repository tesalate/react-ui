import http from '../../services/httpService';

const apiEndpoint = '/vehicle-data';

export const getCompleteDataPoint = async (id: string, vid: string) => {
  let url = `${apiEndpoint}/${id}?vehicle=${vid}`;
  const response = await http.get(url);
  return response;
};

export const getMostRecentDataPoint = async (vid: string) => {
  let url = `${apiEndpoint}/?sortBy=$natural:desc&limit=1&vehicle=${vid}`;
  const response = await http.get(url);
  return response;
};
