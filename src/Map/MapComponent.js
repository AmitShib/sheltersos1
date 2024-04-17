import React, { useEffect, useRef, useState } from 'react';
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
import Point from 'ol/geom/Point'; // Import Point from OpenLayers


import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { fromLonLat } from 'ol/proj';
import { getLength } from 'ol/sphere';

const drawNavigationPath = (mapRef, navigationPath, setNavigationPath, start, end) => {
  // const startCoords = fromLonLat(start);
  // const endCoords = fromLonLat(end);
  const lineString = new LineString([start, end]);
  const pathFeature = new Feature({
    geometry: lineString,
  });

  const vectorSource = new VectorSource({
    features: [pathFeature],
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 3,
      }),
    }),
  });

  if (navigationPath) {
    mapRef.current.removeLayer(navigationPath);
  }
  mapRef.current.addLayer(vectorLayer);
  setNavigationPath(vectorLayer);
};


const MapComponent =  ({ mapRef }) => {

  const mapContainer = useRef(null);

  const [navigationPath, setNavigationPath] = useState(null);

  let currLocation;
    navigator.geolocation.getCurrentPosition((position) => {
    const lonLat = [position.coords.longitude, position.coords.latitude];
    currLocation = fromLonLat(lonLat);
  });


  useEffect(() => {
    // Initialize map and layers
    console.log("currLoc", currLocation);
    const initLocation = currLocation ? currLocation : olProj.fromLonLat([35.2134, 31.7683]);

    const map = new Map({
      target: mapContainer.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        // center: olProj.fromLonLat([35.2134, 31.7683]), // Convert lon/lat to OpenLayers format
        // center: currLocation ? currLocation : olProj.fromLonLat([35.2134, 31.7683]), // Convert lon/lat to OpenLayers format
        center: initLocation, // Convert lon/lat to OpenLayers format
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
      style: styleFunction,
    });
    map.addLayer(geoJsonLayer);


    const pointerSource = new VectorSource();
    const pointerLayer = new VectorLayer({
      source: pointerSource,
    });
    map.addLayer(pointerLayer);

    // Function to add pointer symbol
    const addPointer = (coordinates) => {
      pointerSource.clear(); // Clear previous pointer
      const pointerFeature = new Feature({
        geometry: new Point(coordinates),
        style: new Style({
          image: new Circle({
            radius: 12,
            fill: new Fill({ color: 'blue' }),
            stroke: new Stroke({ color: 'white', width: 4 }),
          }),
        }),
      });
      pointerSource.addFeature(pointerFeature);
    };

    // const coordinates = olProj.fromLonLat([35.2134, 31.7683])

    addPointer(initLocation);


    // Get current location
    /*   NEED TO ENABLE LOCATION AT THE BROWSER   */
    // navigator.geolocation.getCurrentPosition((position) => {
    //   const lonLat = [position.coords.longitude, position.coords.latitude];
    //   const coordinates = fromLonLat(lonLat);
    //   addPointer(coordinates);
    // });



    mapRef.current = map;

    const zoomToShelter = (shelter) => {
      const map = mapRef.current;
      const coordinates = fromLonLat(shelter.coordinates);
      const targetPoint = fromLonLat([35.2134, 31.7683]);
      if (map) {
        map.getView().animate({
          center: coordinates,
          zoom: 18,
          duration: 1000,
        });
        drawNavigationPath(mapRef, navigationPath, setNavigationPath, initLocation, fromLonLat(shelter.coordinates));
      }
    };

    mapRef.current.zoomToShelter = zoomToShelter;


    return () => {
      map.dispose();
    };
  }, []);


  return (
    <div id="map" ref={mapContainer}></div>
  );
};
// export const drawNavigationPath = drawNavigationPath;

export default MapComponent;
export { drawNavigationPath };
