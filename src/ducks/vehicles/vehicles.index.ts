import { Action } from '../types';

/* ===== TYPE_DEFINITION =====*/

export interface IVehicle {
  _id: string;
  vehicles: string;
  collectData: boolean;
  display_name: string;
  tokens: string[];
  id_s: string;
  id: number;
  vehicle_id: number;
  vin: string;
  option_codes: string;
  color: any;
  access_type: string;
  state: string;
  in_service: boolean;
  calendar_enabled: boolean;
  api_version: number;
  backseat_token: any;
  backseat_token_updated_at: any;
  user: string;
  teslaAccount: string;
  selected: boolean;
}

export interface updateVehicleBody {
  collectData: boolean;
}

/* ===== INTERFACE_DEFINITION =====*/
export interface State {
  vehicles: IVehicle[];
  selectedVehicles: [];
  vehiclesError: boolean;
}

/* ===== STATE_DEFINITION ===== */
export const initialState: State = {
  vehicles: [],
  selectedVehicles: [],
  vehiclesError: false,
};

/* ===== TYPES ===== */
export enum ActionTypes {
  REQUEST_VEHICLES = '[VEHICLES] REQUEST_VEHICLES',
  SET_VEHICLES = '[VEHICLES] SET_VEHICLES',
  SET_VEHICLE = '[VEHICLES] SET_VEHICLE',
  SET_SELECTED_VEHICLES = '[VEHICLES] SET_SELECTED_VEHICLES',
  SET_VEHICLES_ERROR = '[VEHICLES] SET_VEHICLES_ERROR',
  UPDATE_VEHICLE = '[VEHICLES] UPDATE_VEHICLE',
  REMOVE_VEHICLES_ERROR = '[VEHICLES] REMOVE_VEHICLES_ERROR',
  SET_VEHICLE_PROPERTIES = '[VEHICLES] SET_VEHICLE_PROPERTIES',
}

/* ===== ACTION_CREATORS ===== */
export const actions = {
  requestVehicles: (): Action => ({ type: ActionTypes.REQUEST_VEHICLES }),
  setVehicles: (value: IVehicle[]): Action => ({ type: ActionTypes.SET_VEHICLES, payload: value }),
  setVehicle: (value: IVehicle): Action => ({ type: ActionTypes.SET_VEHICLE, payload: value }),
  setVehicleProperty: (value: Partial<IVehicle>): Action => ({ type: ActionTypes.SET_VEHICLE_PROPERTIES, payload: value }),
  setSelectedVehicles: (value: string): Action => ({ type: ActionTypes.SET_SELECTED_VEHICLES, payload: value }),
  setVehiclesError: (value: boolean): Action => ({ type: ActionTypes.SET_VEHICLES_ERROR, payload: value }),
  updateVehicle: (_id: string, updateBody: updateVehicleBody): Action => ({ type: ActionTypes.UPDATE_VEHICLE, payload: { _id, body: updateBody } }),
  removeVehiclesError: (value: string): Action => ({ type: ActionTypes.REMOVE_VEHICLES_ERROR, payload: value }),
};

/* ===== SELECTORS ===== */
export const selectors = {
  getSelectedVehicles: (vehicles: IVehicle[]) => vehicles.filter((vehicle) => vehicle.selected).map((vehicle) => vehicle._id),
  getVehicleName: (vehicles: IVehicle[], _id: string) => vehicles.find((vehicle) => vehicle._id === _id)?.display_name ?? '',
};

/* ===== REDUCER ===== */
const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_VEHICLE:
      const newVehiclesState = state.vehicles;
      const idx = newVehiclesState.findIndex((c: IVehicle) => c._id === action.payload._id);
      // if title data from new object is find in old
      idx >= 0
        ? (newVehiclesState[idx] = action.payload)
        : // change data
          newVehiclesState.push(action.payload);
      // in not push it as new
      return { ...state, vehicles: newVehiclesState };
    case ActionTypes.SET_VEHICLES:
      return { ...state, vehicles: action.payload };
    case ActionTypes.SET_SELECTED_VEHICLES:
      return {
        ...state,
        vehicles: state.vehicles.map((vehicle) => {
          return { ...vehicle, selected: vehicle._id === action.payload };
        }),
      };
    case ActionTypes.SET_VEHICLES_ERROR:
      return { ...state, vehiclesError: action.payload };
    case ActionTypes.SET_VEHICLE_PROPERTIES:
      const stateVehicles = state.vehicles;
      var index = stateVehicles.findIndex((vehicle) => vehicle._id === action.payload._id);
      if (index !== -1) {
        Object.keys(action.payload).forEach((key) => {
          (stateVehicles as any)[index][key] = action.payload[key];
        });
      }
      return { ...state, vehicles: stateVehicles };
    default: {
      return state;
    }
  }
};

export default reducer;
