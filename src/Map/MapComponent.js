import React, { useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import './Map.css'; 
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import jerusShelters from '../GisData/jerusalem.geojson';
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

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

    const styleFunction = (feature) => {
      return new Style({
        image: new Circle({
          radius: 6, // Adjust the size of the dot as needed
          fill: new Fill({
            color: 'red', // Set the fill color to red
          }),
          stroke: new Stroke({
            color: 'black', // Set the stroke color
            width: 2, // Set the stroke width
          }),
        }),
      });
    };

    const geoJsonLayer = new VectorLayer({
        source: new VectorSource({
          url: jerusShelters, // Or use local file
          format: new GeoJSON(),
        }),
        style :styleFunction,
      });
      map.addLayer(geoJsonLayer);

    return () => {
      map.dispose();
    };
  }, []);

  return (
    <div id="map"></div>
  );
};

export default MapComponent;
