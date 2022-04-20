import http from '../../services/httpService';

const apiEndpoint = '/tesla-account';

export const getTeslaAccount = async () => {
  let url = `${apiEndpoint}`;
  return await http.get(`${url}`);
};
