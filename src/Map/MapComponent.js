import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import 'ol/ol.css';
import * as olProj from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import React, { useEffect, useRef } from 'react';
import holonShelters from '../GisData/holon.geojson';
import jerusShelters from '../GisData/jerusalem.geojson';
import './Map.css';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { fromLonLat, toLonLat } from 'ol/proj';
import { apiKey } from '../config';

/*   NEED TO ENABLE LOCATION AT THE BROWSER   */
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve([longitude, latitude]);
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};

const currLocation = await getCurrentLocation();

const olCurrLoc = fromLonLat(currLocation);

let initLocation = currLocation ? olCurrLoc : fromLonLat([35.2134, 31.7683]);


const MapComponent = ({ mapRef }) => {

  const mapContainer = useRef(null);

  let navigationPath;

  useEffect(() => {
    // Initialize map and layers
    console.log("currLoc", currLocation);
    const map = new Map({
      target: mapContainer.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: initLocation,
        zoom: 15,
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
        url: jerusShelters,
        format: new GeoJSON(),
      }),
      style: styleFunction,
      minZoom: 13,
    });
    map.addLayer(geoJsonLayer);

    const geoJsonLayer1 = new VectorLayer({
      source: new VectorSource({
        url: holonShelters,
        format: new GeoJSON(),
      }),
      style: styleFunction,
      minZoom: 13,
    });
    map.addLayer(geoJsonLayer1);



    const pointerSource = new VectorSource();
    const pointerLayer = new VectorLayer({
      source: pointerSource,
    });
    map.addLayer(pointerLayer);

    // Function to add pointer symbol
    const addPointer = (coordinates) => {
      pointerSource.clear();
      const pointerFeature = new Feature({
        geometry: new Point(coordinates),
        style: new Style({
          image: new Circle({
            radius: 20,
            fill: new Fill({ color: 'blue' }),
            stroke: new Stroke({ color: 'white', width: 2 }),
          }),
        }),
      });
      pointerSource.addFeature(pointerFeature);
    };

    addPointer(initLocation);



    console.log("navigationPath in map", navigationPath);

    mapRef.current = map;

    const zoomToShelter = (shelter) => {
      const map = mapRef.current;
      const coordinates = fromLonLat(shelter.coordinates);
      if (map) {
        map.getView().animate({
          center: coordinates,
          zoom: 18,
          duration: 1000,
        });
        console.log("navigationPath in zoom", navigationPath);
        drawNavigationPath(initLocation, fromLonLat(shelter.coordinates));

        const intervalId = setInterval(async () => {
          try {
            const newCurrentLocation = await getCurrentLocation();
            const olNewCurrLoc = fromLonLat(newCurrentLocation);
            console.log("newCurrLoc", newCurrentLocation);
            console.log("olnewCurrLoc", olNewCurrLoc);
            addPointer(olNewCurrLoc);
          } catch (error) {
            console.error('Error getting current location:', error);
          }
        }, 10000); // Update every 10 seconds
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);

      }
    };

    mapRef.current.zoomToShelter = zoomToShelter;

    const drawNavigationPath = async (start, end) => {
      const startCoor = toLonLat(start);
      const endCoor = toLonLat(end);
      const apiUrl = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${apiKey}&start=${startCoor[0]},${startCoor[1]}&end=${endCoor[0]},${endCoor[1]}`;

      fetch(apiUrl, {
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        }
      })
        .then(response => {
          console.log('Status:', response.status);
          console.log('Headers:', response.headers);
          return response.json();
        })
        .then(data => {
          console.log('Body:', data);
          const routeCoordinates = data.features[0].geometry.coordinates;

          const convertRouteCoordinates = routeCoordinates.map(coord => fromLonLat(coord));

          console.log("routeCoordinates", routeCoordinates);
          console.log("convertRouteCoordinates", convertRouteCoordinates);

          const lineString = new LineString(convertRouteCoordinates);

          const pathFeature = new Feature({
            geometry: lineString,
          });

          const vectorSource = new VectorSource({
            features: [pathFeature],
          });

          if (navigationPath) {
            mapRef.current.removeLayer(navigationPath);
          }

          navigationPath = null;

          navigationPath = new VectorLayer({
            source: vectorSource,
            style: new Style({
              stroke: new Stroke({
                color: 'blue',
                width: 3,
              }),
            }),
          });

          console.log("navigationPath in draw", navigationPath);


          mapRef.current.addLayer(navigationPath);

        })
        .catch(error => {
          console.error('Error:', error);
        });

    };

    mapRef.current.initLocation = initLocation;


    return () => {
      map.dispose();
    };
  }, []);


  return (
    <div id="map" ref={mapContainer}></div>
  );
};

export default MapComponent;
export { initLocation };

