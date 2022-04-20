import http from '../../services/httpService';
import { updateVehicleBody, IVehicle } from './vehicles.index';

const apiEndpoint = '/vehicles';

export const getVehicles = async (vehicle?: IVehicle['_id']) => {
  let url = `${apiEndpoint}`;
  if (vehicle) url += `/${vehicle}`;
  return await http.get(`${url}`);
};

export const updateVehicle = async (vehicle: string, updateBody: updateVehicleBody) => {
  let url = `${apiEndpoint}`;
  return await http.patch(`${url}/${vehicle}`, { ...updateBody });
};
