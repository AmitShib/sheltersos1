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
import React, { useEffect, useRef, useContext } from 'react';
import holonShelters from '../GisData/holon.geojson';
import jerusShelters from '../GisData/jerusalem.geojson';
import './Map.css';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { fromLonLat, toLonLat } from 'ol/proj';
import { apiKey } from '../config';
import Overlay from 'ol/Overlay';
import { GlobalContext } from '../GlobalContext';
import { toast } from 'react-toastify'; // Import the toast library



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

  const popupRef = useRef(null);

  const { isAdmin, isConnected } = useContext(GlobalContext);


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

    const vectorSourceJer = new VectorSource({
      url: jerusShelters,
      format: new GeoJSON(),
    });

    const geoJsonLayerJer = new VectorLayer({
      source: vectorSourceJer,
      style: styleFunction,
      minZoom: 13,
    });
    map.addLayer(geoJsonLayerJer);


    const vectorSourceHolon = new VectorSource({
      url: holonShelters,
      format: new GeoJSON(),
    });

    const geoJsonLayerHolon = new VectorLayer({
      source: vectorSourceHolon,
      style: styleFunction,
      minZoom: 13,
    });
    map.addLayer(geoJsonLayerHolon);

    const popupElement = document.createElement('div');
    popupElement.className = 'ol-popup';
    popupRef.current = new Overlay({
      element: popupElement,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });
    map.addOverlay(popupRef.current);

    map.on('click', function (event) {
      map.forEachFeatureAtPixel(event.pixel, function (feature) {
        const coordinates = feature.getGeometry().getCoordinates();
        const content = `<p style="color: black; font-size: 12px;"><strong>Coordinates</strong></p><p style="color: black; font-size: 12px;">X: ${coordinates[0]}<br>Y: ${coordinates[1]}</p>`;
        popupRef.current.setPosition(coordinates);
        popupElement.innerHTML = content;
        popupRef.current.setPositioning('top-center');
        popupElement.style.backgroundColor = 'orange';

        setTimeout(() => {
          popupRef.current.setPosition(undefined);
        }, 3000);

      });
    });

    map.getViewport().addEventListener('contextmenu', function (event) {
      event.preventDefault(); // Prevent default context menu
      const pixel = map.getEventPixel(event);
      const features = map.getFeaturesAtPixel(pixel);
      if (features.length > 0) {
        const coordinates = features[0].getGeometry().getCoordinates();
        popupRef.current.setPosition(coordinates);
        const content = `<button class="delete-button" onclick="window.deleteFeature()">Delete</button>`;
        popupElement.innerHTML = content;
        popupRef.current.setPositioning('top-center');
        popupElement.style.backgroundColor = 'orange';

        setTimeout(() => {
          popupRef.current.setPosition(undefined);
        }, 5000);

        window.deleteFeature = function () {
          if (isConnected && isAdmin) {
            vectorSourceHolon.removeFeature(features[0]);
            vectorSourceJer.removeFeature(features[0]);
            popupRef.current.setPosition(undefined);
          } else {
            toast.error('You have to connect and be a manager to delete features'); 
          }
        };
      }
    });


    const stylePointer = (feature) => {
      return new Style({
        image: new Circle({
          radius: 8, 
          fill: new Fill({
            color: 'blue', 
          }),
          stroke: new Stroke({
            color: 'white', 
            width: 2, 
          }),
        }),
      });
    };


    const pointerSource = new VectorSource();
    const pointerLayer = new VectorLayer({
      source: pointerSource,
      style: stylePointer,
    });
    map.addLayer(pointerLayer);

    // Function to add pointer symbol
    const addPointer = (coordinates) => {
      pointerSource.clear();
      const pointerFeature = new Feature({
        geometry: new Point(coordinates),
        style: stylePointer
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
  }, [isConnected, isAdmin]);


  return (
    <div id="map" ref={mapContainer}></div>
  );
};

export default MapComponent;
export { initLocation };

