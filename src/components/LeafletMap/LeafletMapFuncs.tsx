import { objectIdToCreationDate } from '../../utils/convert';

export const mapPointsToGeoJSON = (mapPoints: Array<any>) => {
  return mapPoints.map((el, idx) => {
    return {
      type: 'Feature',
      properties: {
        id: idx,
        ground: idx,
        popupContent: `
        Data points: ${el.visitCount}<br/>
        First visited: ${objectIdToCreationDate(el._id)}<br/>
        Last visited: ${el.lastModified}<br/>
        lat/long: ${JSON.parse(el.latLongString)}<br/>
      `,
      },
      geometry: el.geoJSON,
    };
  });
};
