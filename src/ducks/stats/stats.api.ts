import http from "../../services/httpService";

const apiEndpoint = '/stats';


export const getAStat = async (vid: string, type : string ) => {
  let url = `${apiEndpoint}/get${type}?vid=${vid}`
  const response = await http.get(url);
  return response;
};
