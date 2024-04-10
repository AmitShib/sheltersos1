import React, { useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import './Map.css'; 


const MapComponent = () => {
  useEffect(() => {
    // Initialize map and layers
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: olProj.fromLonLat([35.2134, 31.7683]), // Convert lon/lat to OpenLayers format
        zoom: 13,
      }),
    });

    // Clean up function
    return () => {
      map.dispose();
    };
  }, []);

  return (
    <div id="map"></div>
  );
};

export default MapComponent;
