import http from '../../services/httpService';

const apiEndpoint = '/auth';

export const login = async (email: string, password: string) => {
  const url = `${apiEndpoint}/login`;
  const response = await http.post(url, { email, password });
  return response;
};

export const logout = async () => {
  const url = `${apiEndpoint}/logout`;
  const response = await http.post(url);
  return response;
};

export const me = async (id: string) => {
  const url = `/users/${id}`;
  const response = await http.get(url);
  return response;
};

export const updateVehicleMiningStatus = async (vid: string, active: boolean) => {
  const url = `/vehicle/updateVehicleMiningStatus?vid=${vid}&active=${active}`;
  const response = await http.post(url);
  return response;
};

export const setSelectedVehicle = async (vid: string) => {
  const url = `/vehicle/updateSelectedVehicle?vid=${vid}`;
  const response = await http.post(url);
  return response;
};

export const updateMe = async (obj: any) => {
  const url = `/users/me`;
  const response = await http.put(url, { ...obj });
  return response;
};

export const teslaLogin = async ({ userId, username, password, refreshToken }: { userId: string; username?: string; password?: string; refreshToken?: string }) => {
  const url = `/tesla/login`;
  const response = await http.post(url, { userId, username, password, refreshToken });
  return response;
};

export const sendVerificationEmail = async () => {
  const url = `${apiEndpoint}/send-verification-email/`;
  const response = await http.post(url);
  return response;
};

export const verifyEmail = async (token: string) => {
  const url = `${apiEndpoint}/verify-email?token=${token}`;
  const response = await http.post(url);
  return response;
};
