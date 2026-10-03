'use strict';

const VALID_GEOMETRIES = new Set(['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon', 'GeometryCollection']);

const inspectGeoJSON = (document) => {
  if (!document || typeof document !== 'object' || Array.isArray(document)) throw new Error('GeoJSON input must be a JSON object.');
  if (document.type !== 'FeatureCollection' || !Array.isArray(document.features)) throw new Error('Only GeoJSON FeatureCollection documents are supported.');
  if (document.features.length > 10000) throw new Error('FeatureCollection exceeds the 10,000 feature inspection limit.');

  const geometryTypes = {};
  const propertyNames = new Set();
  const duplicateIds = new Set();
  const seenIds = new Set();
  const issues = [];

  document.features.forEach((feature, index) => {
    if (!feature || feature.type !== 'Feature') issues.push({ feature: index, code: 'INVALID_FEATURE', message: 'Item is not a GeoJSON Feature.' });
    const geometryType = feature?.geometry?.type;
    if (!geometryType) issues.push({ feature: index, code: 'MISSING_GEOMETRY', message: 'Feature has no geometry.' });
    else if (!VALID_GEOMETRIES.has(geometryType)) issues.push({ feature: index, code: 'INVALID_GEOMETRY_TYPE', message: `Unsupported geometry type: ${geometryType}.` });
    else geometryTypes[geometryType] = (geometryTypes[geometryType] || 0) + 1;
    Object.keys(feature?.properties || {}).forEach((name) => propertyNames.add(name));
    if (feature?.id !== undefined && feature.id !== null) {
      const key = String(feature.id);
      if (seenIds.has(key)) duplicateIds.add(key);
      seenIds.add(key);
    }
  });

  return { format: 'GeoJSON', featureCount: document.features.length, coordinateReferenceSystem: document.crs?.properties?.name || 'RFC 7946 default (WGS 84 longitude/latitude)', geometryTypes, propertyNames: [...propertyNames].sort(), duplicateFeatureIds: [...duplicateIds].sort(), issues, validForPreparation: issues.length === 0 && duplicateIds.size === 0, note: 'Read-only structural inspection; coordinates were not reprojected and no source data was modified.' };
};

module.exports = { inspectGeoJSON };
