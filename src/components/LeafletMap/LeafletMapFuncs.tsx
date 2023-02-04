import { objectIdToCreationDate } from '../../utils/convert';
import { numberWithCommas } from '../../utils/formatFunctions';

export const mapPointsToGeoJSON = (mapPoints: Array<any>) => {
  return mapPoints.map((el, idx) => {
    return {
      type: 'Feature',
      properties: {
        id: idx,
        ground: idx,
        popupContent: `
        <b>Visit Count:</b><br/>${numberWithCommas(el.visitCount)}<br/><br/>
        <b>First Visited:</b><br/>${objectIdToCreationDate(el._id).toLocaleString()}<br/><br/>
        <b>Last Visited:</b><br/>${new Date(el.updatedAt).toLocaleString()}<br/><br/>
      `,
      },
      geometry: el.geoJSON,
    };
  });
};
