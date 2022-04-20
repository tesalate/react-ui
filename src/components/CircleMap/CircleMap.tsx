import React, { useCallback, useMemo, useState } from 'react';
import { MapContainer, /*CircleMarker, Tooltip,*/ TileLayer, Marker, Popup, useMapEvents, useMap, LayersControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Link, useLocation, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useQuery } from '../../utils/customHooks';
import { IChargeSession } from '../../ducks/chargeSessions/chargeSessions.index';
require('react-leaflet-markercluster/dist/styles.min.css');

interface ICircleProps {
  mapPoints: Array<IChargeSession>;
  style?: Record<any, any>;
  loading: boolean;
  theme: string | undefined;
  zoom?: boolean;
  zoomLevel?: number;
  error: boolean;
  boundOptions?: Record<any, any>;
  zoomSnap?: number;
}

const CircleMap = (props: ICircleProps) => {
  const { mapPoints, theme } = props;
  const query = useQuery();
  const [zoomLevel, setZoomLevel] = useState(Number(query.get('zoom')) || 4);
  const [center, setCenter] = useState(
    query
      .get('center')
      ?.split(',')
      .map((num: string) => parseFloat(num)) ?? [40, -100]
  );
  const location = useLocation();
  const history = useHistory();

  const style = {
    borderRadius: '.6rem',
    border: 'var(--main-border-style)',
  };

  const bounds: Array<[number, number]> = [];

  const data = useMemo(() => {
    return mapPoints.map((dataItem, k: number) => {
      let { geoJSON = { coordinates: [] }, _id, supercharger, startDate, maxChargeRate, energyAdded } = dataItem;
      let { coordinates } = geoJSON;
      if (supercharger?.title && !supercharger?.title.toLowerCase().includes('supercharger')) supercharger.title += ' Supercharger';
      const [a, b] = coordinates as [number, number];
      if (a && b) {
        bounds.push([b, a]);
        return (
          <Marker position={[b, a]} key={k}>
            <Popup>
              <p>
                <b>{supercharger?.title}</b>
              </p>
              <p>
                Date: <Moment format={'MM/DD/YYYY HH:mm:ss'}>{startDate}</Moment>
              </p>
              <p>Max Rate: {maxChargeRate}kW</p>
              <p>Energy Added: {energyAdded}kWh</p>
              <Link to={`/charge-sessions/${_id}`}>
                <b>View Session</b>
              </Link>
            </Popup>
          </Marker>
        );
      }
      return;
    });
    // eslint-disable-next-line
  }, [mapPoints]);

  const _addQuery = useCallback(
    (a, b) => {
      const addQuery = (key: string, value: string) => {
        let pathname = location.pathname;
        // returns path: '/app/books'
        let searchParams = new URLSearchParams(location.search);
        // returns the existing query string: '?type=fiction&author=fahid'
        searchParams.set(key, value);
        history.push({
          pathname: pathname,
          search: searchParams.toString(),
        });
      };
      addQuery(a, b);
    },
    [history, location.pathname, location.search]
  );

  useEffect(() => {
    _addQuery('center', center.toString());
  }, [center, _addQuery]);

  useEffect(() => {
    _addQuery('zoom', zoomLevel.toString());
  }, [zoomLevel, _addQuery]);

  function MyComponent() {
    const map = useMap();

    const mapEvents = useMapEvents({
      zoomend: () => {
        setCenter([mapEvents.getCenter().lat, mapEvents.getCenter().lng]);
        setZoomLevel(mapEvents.getZoom());
      },
      dragend: () => {
        setCenter([mapEvents.getCenter().lat, mapEvents.getCenter().lng]);
      },
      moveend: () => {
        setCenter([mapEvents.getCenter().lat, mapEvents.getCenter().lng]);
        setZoomLevel(mapEvents.getZoom());
      },
    });

    map.whenReady(() => {
      if (bounds?.length > 0) {
        map.flyToBounds(bounds);
      }
    });

    return (
      <span style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', zIndex: 999999 }}>
        <Button size="sm" variant={theme === 'dark' ? 'outline-light' : 'light'} disabled>
          {data.length} total sessions
        </Button>
      </span>
    );
  }

  return (
    <MapContainer
      style={{ height: 'calc(var(--vh, 1vh) * 80)', width: '100%', opacity: '0.9', ...style }}
      zoom={zoomLevel}
      maxZoom={18}
      center={center as [number, number]}
      attributionControl={false}
      bounds={bounds}
      tap={false}
      className="mb-2"
    >
      <LayersControl>
        <LayersControl.BaseLayer checked={theme === 'dark'} name="basemaps.dark_all">
          <TileLayer attribution='&copy; <a href="https://{s}.basemaps.cartocdn.comt">basemaps</a> contributors' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked={theme === 'light'} name="stadiamaps.alidade_smooth">
          <TileLayer attribution='&copy; <a href="https://tiles.stadiamaps.com">stadiamaps</a> contributors' url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
        </LayersControl.BaseLayer>
        <MyComponent />
        <MarkerClusterGroup>{data}</MarkerClusterGroup>
      </LayersControl>
    </MapContainer>
  );
};
export default CircleMap;
