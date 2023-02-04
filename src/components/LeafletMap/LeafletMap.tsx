import React, { useCallback, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Marker, Popup, GeoJSON, useMap, /*ZoomControl,*/ LayersControl } from 'react-leaflet';
import L, { divIcon } from 'leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { actions as completeDataPointsActions } from '../../ducks/completeDataPoints/completeDataPoints.index';
import { State as UIState } from '../../ducks/ui/ui.index';
import { actions as uiActions } from '../../ducks/ui/ui.index';
import { useEffect, useMemo } from 'react';
import { useState } from 'react';
import LeafletPopupData from './LeafletPopupData';
import { useLocation } from 'react-router-dom';
import { mapPointsToGeoJSON } from './LeafletMapFuncs';

// IMAGES
import purpleIcon from '../../assets/dot-purple.png';
import grayIcon from '../../assets/dot-gray.png';
import teslaIcon from '../../assets/model_three.png';

import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import { Col, Form, Row, Spinner } from 'react-bootstrap';
import { debounce } from 'lodash';

import { IMapPoint } from '../../ducks/mapPoints/mapPoints.index';
import MapPointInfo from './MapPointInfo';

import 'leaflet-rotatedmarker';
import { usePreloadImages } from '../../utils/customHooks';
// import 'leaflet/dist/leaflet.css';
import { selectors as vehicleSelectors } from '../../ducks/vehicles/vehicles.index';

export interface IBreadCrumbProps {
  data: Array<IMapPoint>;
  style: Record<any, any>;
  loading: boolean;
  theme: UIState['theme'];
  zoom?: boolean;
  geoJson: boolean;
  zoomLevel?: number;
  error: boolean;
  boundOptions?: Record<any, any>;
  zoomSnap?: number;
  _id?: string;
}

const LeafletMap = (props: IBreadCrumbProps) => {
  const preload = [purpleIcon, grayIcon, teslaIcon];
  usePreloadImages(preload);

  const dispatch = useDispatch();
  const [selectedPointId, setSelectedPointId] = useState<{ _id?: string; vehicle?: string }>({ vehicle: undefined, _id: undefined });
  const [bounds, setBounds]: any = useState();
  const markerRef = useRef<any>(null);
  const firstLoadRef = useRef<any>([]);
  const sessionRef = useRef<string | undefined>(props._id);
  const location = useLocation();
  const home = location.pathname === '/';
  const mapPage = location.pathname === '/map';
  const drivePage = location.pathname.includes('/drive-sessions');

  const {
    completeDataPointsState: { dataPoints },
    vehicles,
    distanceBetween,
    isMobile,
    vertical,
  } = useSelector(({ completeDataPointsState, uiState, vehiclesState }: RootState) => ({
    completeDataPointsState: {
      dataPoints: completeDataPointsState.dataPoints,
    },
    distanceBetween: uiState.map.distanceBetween,
    vehicles: vehiclesState['vehicles'],
    isMobile: uiState.isMobile,
    vertical: uiState.windowDimensions.width < uiState.windowDimensions.height,
  }));

  const { data: mapPoints, style, theme, geoJson = false, error = false, loading = false } = props;

  const dotIcon = useMemo(
    () =>
      divIcon({
        className: `dot ${theme === 'dark' ? '' : ''}`,
        popupAnchor: [0, 0],
        iconSize: [10, 10],
        html: `<span></span>`,
      }),
    [theme]
  );

  const currentVehicles = useMemo(() => vehicleSelectors.getSelectedVehicles(vehicles), [vehicles]);

  const modelThreeIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: teslaIcon,
        popupAnchor: [0, 0],
        iconSize: [3 * 11, 4 * 11],
      }),
    []
  );

  const onMarkerClick = (_id: string, vehicle: string) => {
    console.log('WHAT: ', { _id, vehicle, mapPoints });
    setSelectedPointId({ _id, vehicle });
  };

  useEffect(() => {
    if (selectedPointId._id && selectedPointId.vehicle && !(dataPoints as { [key: string]: {} })[selectedPointId._id]) {
      dispatch(completeDataPointsActions.requestCompleteDataPoint(selectedPointId._id, selectedPointId.vehicle));
    }
  }, [selectedPointId, currentVehicles, dataPoints, dispatch]);

  const _bounds = useMemo(() => {
    return mapPoints.map((data) => {
      const { dataPoints } = data;
      const [first] = dataPoints;
      return [first.drive_state.latitude, first.drive_state.longitude];
    });
  }, [mapPoints]);

  useEffect(() => {
    setBounds(_bounds);
  }, [mapPoints, _bounds, geoJson, error]);

  const geoJSONData = useMemo(() => (geoJson && mapPoints ? mapPointsToGeoJSON(mapPoints) : null), [geoJson, mapPoints]);

  const SliderWithInputFormControl = () => {
    const delayedQuery = useCallback(
      debounce((val: any) => {
        dispatch(uiActions.setDistanceBetween(parseInt(val)));
        dispatch(uiActions.setDBUiSettings({ map: { distanceBetween: parseInt(val) } }));
      }, 1000),
      []
    );
    const [value, setValue] = React.useState(distanceBetween);

    return (
      <Form id="slider">
        <Form.Group as={Row} className="m-0 p-0">
          <Col xs="9">
            <RangeSlider
              step={2}
              min={2}
              max={200}
              size="sm"
              value={value}
              onAfterChange={(e: any) => delayedQuery(e.target.value)}
              tooltipPlacement="top"
              tooltipLabel={(currentValue) => `${currentValue} km between map points`}
              variant={theme === 'dark' ? 'light' : 'dark'}
              onChange={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                setValue(e.target.value);
              }}
            />
          </Col>
          <Col xs="3" className="m-0 px-0 d-flex align-items-center" style={{ fontSize: '.7rem' }}>
            {value} km
          </Col>
        </Form.Group>
      </Form>
    );
  };

  const MyComponent = () => {
    const map = useMap();
    map.whenReady(() => {
      // ONLY SET BOUNDS WHEN THE PAGE FIRST LOADS
      if (bounds.length >= 1 && (firstLoadRef.current !== bounds.length || sessionRef.current !== props._id)) {
        firstLoadRef.current = bounds.length;
        sessionRef.current = props._id;
        if (home) {
          if (bounds.length === 1) map.flyTo(bounds[0], 16);
          else map.flyToBounds(bounds, { paddingTopLeft: isMobile && vertical ? [0, 0] : [280, 60] });
        } else if (mapPage) {
          map.setView(bounds[0], 14);
        } else if (drivePage) {
          map.fitBounds(bounds, { animate: false });
        }
      }
    });
    setTimeout(() => map.invalidateSize(), 400); // <- https://stackoverflow.com/questions/24412325/resizing-a-leaflet-map-on-container-resize
    return <></>;
  };

  const marker = markerRef.current;

  return (
    <span className={`${home && 'd-none d-sm-none d-md-block'}`}>
      <span style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 999999, minWidth: '180px' }} className={`${drivePage && 'd-none'}`}>
        {home && (
          <span className="mb-2">
            {' '}
            <SliderWithInputFormControl />{' '}
          </span>
        )}
        <MapPointInfo mapPointsError={error} loading={loading} theme={theme ?? undefined} data={mapPoints} />
      </span>
      <MapContainer zoom={4} style={{ ...style }} center={[40, -100]} bounds={bounds} zoomControl={false} preferCanvas={true} tap={false}>
        <LayersControl>
          <LayersControl.BaseLayer checked={theme === 'dark'} name="basemaps.dark_all">
            <TileLayer attribution='&copy; <a href="https://{s}.basemaps.cartocdn.comt">basemaps</a> contributors' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked={theme === 'light'} name="stadiamaps.alidade_smooth">
            <TileLayer attribution='&copy; <a href="https://tiles.stadiamaps.com">stadiamaps</a> contributors' url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
          </LayersControl.BaseLayer>
          {/* {!drivePage && <ZoomControl position="bottomleft" /> } */}
          <MyComponent />
          {
            // location.pathname !== "/" ? <RoutingMachine waypoints={mapPoints.map(e => [e.drive_state.latitude, e.drive_state.longitude])} />
            // :
            !!geoJson && (
              <GeoJSON
                key={Math.random()}
                data={geoJSONData as any}
                style={(feature: any): any => {
                  if (feature.properties.id === 0) {
                    return { color: 'rgb(54, 162, 235)', fillColor: 'rgba(54, 162, 235, 0.4)' };
                  } else {
                    return { color: 'rgba(153, 102, 255)', fillColor: 'rgba(153, 102, 255, 0.4)' };
                  }
                }}
                onEachFeature={(feature, layer): any => {
                  if (feature.properties && feature.properties.popupContent) {
                    layer.bindPopup(feature.properties.popupContent);
                  }
                }}
              />
            )
          }
          {mapPoints.map((_position, idx) => {
            const current = _position['dataPoints'][0];
            const PopupComp = (
              <Popup key={`popup-${current._id}`} minWidth={200} maxWidth={860}>
                {!(dataPoints as { [key: string]: {} })[current._id] && current._id === selectedPointId._id ? (
                  <div className="d-flex justify-content-center">
                    {' '}
                    <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                  </div>
                ) : null}
                {(dataPoints as { [key: string]: {} })[current._id] && current._id === selectedPointId._id ? LeafletPopupData({ ...(dataPoints as { [key: string]: {} })[current._id], vehicle: currentVehicles[0], home }) : null}
              </Popup>
            );

            if (geoJson && idx > 0) {
              return null;
            }

            if (marker && idx === 0) {
              marker.setRotationAngle(current.drive_state.heading);
              marker.setRotationOrigin('center center');
            }

            return (
              <FeatureGroup key={`fg-${current._id}`}>
                {idx === 0 ? (
                  <Marker
                    ref={(ref) => {
                      markerRef.current = ref;
                    }}
                    key={`marker-${current._id}`}
                    position={[current.drive_state.latitude, current.drive_state.longitude]}
                    icon={modelThreeIcon}
                    eventHandlers={{ click: () => onMarkerClick(current._id, currentVehicles[0]) }}
                  >
                    {PopupComp}
                  </Marker>
                ) : (
                  <Marker key={`marker-${current._id}`} position={[current.drive_state.latitude ?? 0, current.drive_state.longitude ?? 0]} icon={dotIcon} eventHandlers={{ click: () => onMarkerClick(current._id, currentVehicles[0]) }}>
                    {PopupComp}
                  </Marker>
                )}
              </FeatureGroup>
            );
          })}
        </LayersControl>
      </MapContainer>
    </span>
  );
};

export default LeafletMap;
