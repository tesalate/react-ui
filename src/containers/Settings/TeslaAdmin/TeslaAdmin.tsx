import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as teslaAccountActions } from '../../../ducks/teslaAccount/teslaAccount.index';
import { actions as vehiclesActions } from '../../../ducks/vehicles/vehicles.index';
import { RootState } from '../../../redux/reducers';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import FlatInfoComp from '../../../components/FlatInfoComp/FlatInfoComp';
import { TeslaLoginForm } from '../../../components/TeslaLoginForm/TeslaLoginForm';
import Switch from 'react-switch';
import ThemedSkeleton from '../../../components/ThemedSkeleton/ThemedSkeleton';
import { ITeslaAccount } from '../../../ducks/teslaAccount/teslaAccount.index';
import { IVehicle } from '../../../ducks/vehicles/vehicles.index';

interface TeslaAdminProps {
  account: ITeslaAccount;
}

const TeslaAdmin: React.FC<TeslaAdminProps> = ({ account }) => {
  const dispatch = useDispatch();

  const { vehicles, teslaAccountLinked, email, theme, refreshingAccount, vehicleLoading } = useSelector(({ teslaAccountState, uiState, vehiclesState }: RootState) => ({
    vehicles: vehiclesState.vehicles,
    teslaAccountLinked: teslaAccountState.account?.linked ?? false,
    email: teslaAccountState.account?.email ?? '',
    theme: uiState.theme,
    refreshingAccount: uiState.loading['RefreshingAccount'].length > 0,
    vehicleLoading: uiState.loading['TeslaVehiclesLoading'].length > 0,
  }));

  const titleMap: any = {
    display_name: 'display name',
    state: 'state',
    collectData: 'data collection',
  };

  const TeslaVehicles: React.FC<{}> = () => {
    const vehiclesInTeslaAccount = useMemo(() => vehicles.filter((el: IVehicle) => el.teslaAccount === account._id), []);
    const length = vehiclesInTeslaAccount.length;

    const LoadingVehicles: React.FC<{}> = () => {
      return (
        <Col sm={12} style={{ border: 'var(--main-border-style)', position: 'relative', overflow: 'hidden', minHeight: '60px' }} className="rounded py-2 mb-2 px-3">
          <Row>
            <Col className="100-h">
              <ThemedSkeleton />
              <ThemedSkeleton />
            </Col>
            <Col className="100-h">
              <ThemedSkeleton />
              <ThemedSkeleton />
            </Col>
            <Col className="100-h">
              <ThemedSkeleton />
              <ThemedSkeleton />
            </Col>
          </Row>
        </Col>
      );
    };

    return (
      <>
        {length > 0 && (
          <p>
            <small>Enabling data collections allows us to gather information on your vehicle{length > 1 && 's'} to display in this application</small>
          </p>
        )}
        {refreshingAccount ? (
          <LoadingVehicles />
        ) : (
          vehiclesInTeslaAccount.map((el: any, idx: number) => {
            const collectData = el['collectData'];

            return (
              <Col key={idx} sm={12} style={{ border: 'var(--main-border-style)', position: 'relative', overflow: 'hidden' }} className="rounded py-2 mb-2 px-3">
                {
                  <span
                    style={{
                      borderLeft: `5px solid ${collectData ? '#198754' : '#dc3545'}`,
                      position: 'absolute',
                      left: 0,
                      top: 0,
                    }}
                    className="w-100 h-100 p-0 m-0"
                  />
                }
                {refreshingAccount && (
                  <div
                    className="h-100 w-100 d-flex justify-content-center align-items-center m-0 rounded"
                    style={{
                      background: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.2)',
                      position: 'absolute',
                      zIndex: 99999,
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <Spinner as="span" animation="border" role="status" aria-hidden="true" className="m-2" variant="light" />
                  </div>
                )}
                <Row className="d-flex justify-content-between">
                  {['display_name', 'state', 'collectData'].map((key: any, idx: number) => {
                    if (titleMap[key]) {
                      const cardInfo = {
                        text:
                          key === 'collectData' ? (
                            <Switch
                              onChange={() => dispatch(vehiclesActions.updateVehicle(el._id, { collectData: !collectData }))}
                              checked={el[key]}
                              height={20}
                              width={40}
                              disabled={refreshingAccount}
                              offColor="#BEBEBE"
                              onColor="#198754"
                            />
                          ) : (
                            el[key]
                          ),
                        label: titleMap[key],
                        textStyle: { lineHeight: '20px', fontSize: '1.01rem' },
                        labelStyle: { fontSize: '.86rem', lineHeight: '20px' },
                      };
                      return (
                        <Col xs="auto" key={`${idx}-col`}>
                          <FlatInfoComp {...cardInfo} key={idx} />
                        </Col>
                      );
                    }
                    return null;
                  })}
                </Row>
              </Col>
            );
          })
        )}
      </>
    );
  };

  const NotLinked = () => {
    return <TeslaLoginForm email={email} theme={theme} />;
  };

  const Linked = () => {
    return (
      <div style={{ touchAction: 'pan-y' }}>
        <Row className="mb-5">
          <Col>
            <p>
              Email: <strong>{email}</strong>
            </p>
          </Col>
          <Col>
            <Button disabled={vehicleLoading} size={'sm'} variant="outline-secondary" className="float-end" style={{ minWidth: '126px' }} onClick={() => dispatch(teslaAccountActions.refreshTeslaAccount())}>
              {vehicleLoading ? <Spinner size="sm" as="span" animation="border" role="status" aria-hidden="true" /> : 'Refresh Tesla Account'}
            </Button>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col>
            <span className="d-flex justify-content-between">
              <h4>Vehicles</h4>
            </span>
            <hr />
            <Row>
              <Col>
                <TeslaVehicles />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col>
            <h4 className="text-danger">Danger Zone</h4>
            <hr />
            <Button size={'sm'} variant="outline-danger">
              Unlink Account
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <>
      <h4>Tesla Account</h4>
      <hr />
      {teslaAccountLinked ? <Linked /> : <NotLinked />}
    </>
  );
};
export default TeslaAdmin;
