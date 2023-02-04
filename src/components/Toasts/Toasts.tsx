import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { Toast, ToastContainer } from 'react-bootstrap';
import { IToastObj } from '../../ducks/toasts/toasts.index';
import Moment from 'react-moment';
import { useDispatch } from 'react-redux';
import { actions as toastActions } from '../../ducks/toasts/toasts.index';
import { actions as vehiclesActions, selectors as vehicleSelectors } from '../../ducks/vehicles/vehicles.index';
import { Link } from 'react-router-dom';
import sessionIcons from '../../utils/sessionIcons';

const Toasts = () => {
  const dispatch = useDispatch();

  const { theme, activeToasts, isMobile, vehicles } = useSelector(({ uiState, toastsState, vehiclesState }: RootState) => ({
    theme: uiState.theme,
    activeToasts: toastsState.activeToasts,
    isMobile: uiState.isMobile,
    vehicles: vehiclesState.vehicles,
  }));

  const handleClick = ({ _id, vid }: IToastObj) => {
    dispatch(toastActions.removeToasts(_id));
    dispatch(vehiclesActions.setSelectedVehicles(vid));
  };

  const style = useMemo(() => {
    const baseStyle = {
      borderRadius: '.6rem',
    };
    return theme === 'dark'
      ? {
          ...baseStyle,
          backgroundColor: '#212529',
        }
      : {
          ...baseStyle,
        };
  }, [theme]);

  return (
    <ToastContainer className={`mb-${isMobile ? '4' : '2'}`} position={'bottom-center'} style={{ zIndex: 9999999 }}>
      {activeToasts
        .sort((a: IToastObj, b: IToastObj) => new Date(b.startDate).valueOf() - new Date(a.startDate).valueOf())
        .map((toastObj: IToastObj) => {
          const { _id, vid, type, startDate } = toastObj;
          return (
            <Toast key={_id} onClose={() => handleClick(toastObj)} animation={true} style={{ ...style }}>
              <Toast.Header style={{ ...style, borderRadius: '.6rem' }}>
                <Link to={`/${type}-sessions/${_id}`} onClick={() => handleClick(toastObj)} style={{ textDecoration: 'none' }} className="me-auto">
                  {sessionIcons.get(type)}
                  <strong>
                    {vehicleSelectors.getVehicleName(vehicles, vid)} started {type.split('-')[0]?.replace('e', 'ing')}
                  </strong>
                </Link>
                <small className="text-muted text-end">
                  <Moment fromNow>{startDate}</Moment>
                </small>
              </Toast.Header>
            </Toast>
          );
        })}
    </ToastContainer>
  );
};
export default Toasts;
