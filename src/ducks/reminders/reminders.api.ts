import http from '../../services/httpService';

const apiEndpoint = '/reminders';

export const getAllReminders = async (vid: string) => {
  let url = `${apiEndpoint}?vehicle=${vid}`;
  const response = await http.get(url);
  return response;
};

export const setReminder = async (body: any) => {
  let url = `${apiEndpoint}/setReminder`;
  const response = await http.get(url, { ...body });
  return response;
};
