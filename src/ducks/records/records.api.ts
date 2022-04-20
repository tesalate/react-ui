import http from "../../services/httpService";

const apiEndpoint = '/record';

export const getRecordTypes = async () => {
  let url = `${apiEndpoint}/getRecordTypes`
  const response = await http.get(url);
  return response;
};

export const getAllRecords = async (vid: number) => {
  let url = `${apiEndpoint}/getAllRecords?vid=${vid}`
  const response = await http.get(url);
  return response;
};

export const getRecordBySystemKey = async (systemKey: string, vid: number) => {
  let url = `${apiEndpoint}/getRecordBySystemKey?systemKey=${systemKey}&vid=${vid}`
  const response = await http.get(url);
  return response;
};
