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
import holonShelters from '../GisData/holon.geojson';
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Point from 'ol/geom/Point'; // Import Point from OpenLayers


import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { fromLonLat, toLonLat } from 'ol/proj';
import { getLength } from 'ol/sphere';



// //GOOD ONE 
// const drawNavigationPath = async (mapRef, navigationPath, setNavigationPath, start, end) => {
//   // Construct the URL for the OpenRouteService API
//   const apiKey = '5b3ce3597851110001cf6248dcce93c663f14ff7beca4d4b42af8eee'; // Replace with your actual API key
//   const startCoor = toLonLat(start);
//   const endCoor = toLonLat(end);
//   const apiUrl = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${apiKey}&start=${startCoor[0]},${startCoor[1]}&end=${endCoor[0]},${endCoor[1]}`;

//   fetch(apiUrl, {
//     headers: {
//       'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
//     }
//   })
//     .then(response => {
//       console.log('Status:', response.status);
//       console.log('Headers:', response.headers);
//       return response.json();
//     })
//     .then(data => {
//       console.log('Body:', data);
//       const routeCoordinates = data.features[0].geometry.coordinates;

//       const convertRouteCoordinates = routeCoordinates.map(coord => fromLonLat(coord));

//       console.log("routeCoordinates", routeCoordinates);
//       console.log("convertRouteCoordinates", convertRouteCoordinates);

//       // Create a LineString geometry from the route coordinates
//       const lineString = new LineString(convertRouteCoordinates);

//       // Create a feature from the LineString geometry
//       const pathFeature = new Feature({
//         geometry: lineString,
//       });

//       // Create a VectorSource with the path feature
//       const vectorSource = new VectorSource({
//         features: [pathFeature],
//       });

//       // Create a VectorLayer with the VectorSource and style it
//       const vectorLayer = new VectorLayer({
//         source: vectorSource,
//         style: new Style({
//           stroke: new Stroke({
//             color: 'blue',
//             width: 3,
//           }),
//         }),
//       });

//       console.log("navigationPath in draw", navigationPath);
//       // Remove the previous navigation path layer from the map if it exists
//       if (navigationPath) {
//         mapRef.current.removeLayer(navigationPath);
//       }

//       // // Add the new navigation path layer to the map
//       mapRef.current.addLayer(vectorLayer);

//       // Update the navigationPath state with the new layer
//       setNavigationPath(vectorLayer);


//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });

// };

/*   NEED TO ENABLE LOCATION AT THE BROWSER   */
let currLocation;
await navigator.geolocation.getCurrentPosition((position) => {
  const lonLat = [position.coords.longitude, position.coords.latitude];
  currLocation = fromLonLat(lonLat);
});

let initLocation = currLocation ? currLocation : olProj.fromLonLat([35.2134, 31.7683]);


const MapComponent = ({ mapRef }) => {

  const mapContainer = useRef(null);

  // const [navigationPath, setNavigationPath] = useState(null);
  let navigationPath;

  // let currLocation;
  //   navigator.geolocation.getCurrentPosition((position) => {
  //   const lonLat = [position.coords.longitude, position.coords.latitude];
  //   currLocation = fromLonLat(lonLat);
  // });


  useEffect(() => {
    // Initialize map and layers
    console.log("currLoc", currLocation);
    // const initLocation = currLocation ? currLocation : olProj.fromLonLat([35.2134, 31.7683]);
    initLocation = currLocation ? currLocation : olProj.fromLonLat([35.2134, 31.7683]);

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

    const geoJsonLayer1 = new VectorLayer({
      source: new VectorSource({
        url: holonShelters, // Or use local file
        format: new GeoJSON(),
      }),
      style: styleFunction,
    });
    map.addLayer(geoJsonLayer1);



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



    console.log("navigationPath in map", navigationPath);

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
        console.log("navigationPath in zoom", navigationPath);
        drawNavigationPath(initLocation, fromLonLat(shelter.coordinates));
      }
    };

    mapRef.current.zoomToShelter = zoomToShelter;

    const drawNavigationPath = async (start, end) => {
      // Construct the URL for the OpenRouteService API
      const apiKey = '5b3ce3597851110001cf6248dcce93c663f14ff7beca4d4b42af8eee'; // Replace with your actual API key
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

          // Create a LineString geometry from the route coordinates
          const lineString = new LineString(convertRouteCoordinates);

          // Create a feature from the LineString geometry
          const pathFeature = new Feature({
            geometry: lineString,
          });

          // Create a VectorSource with the path feature
          const vectorSource = new VectorSource({
            features: [pathFeature],
          });

          // Remove the previous navigation path layer from the map if it exists
          if (navigationPath) {
            mapRef.current.removeLayer(navigationPath);
          }

          navigationPath = null;

          // Create a VectorLayer with the VectorSource and style it
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
          

          // // Add the new navigation path layer to the map
          mapRef.current.addLayer(navigationPath);

          // Update the navigationPath state with the new layer
          // setNavigationPath(vectorLayer);


        })
        .catch(error => {
          console.error('Error:', error);
        });

    };


    // const drawNavigationPath = (start, end) => {
    //   // const startCoords = fromLonLat(start);
    //   // const endCoords = fromLonLat(end);
    //   console.log("drawNav navPath", navigationPath);
    //   const lineString = new LineString([start, end]);
    //   const pathFeature = new Feature({
    //     geometry: lineString,
    //   });

    //   const vectorSource = new VectorSource({
    //     features: [pathFeature],
    //   });

    //   if (navigationPath) {
    //     mapRef.current.removeLayer(navigationPath);
    //   }

    //   navigationPath = null;

    //   navigationPath = new VectorLayer({
    //     source: vectorSource,
    //     style: new Style({
    //       stroke: new Stroke({
    //         color: 'blue',
    //         width: 3,
    //       }),
    //     }),
    //   });

    //   mapRef.current.addLayer(navigationPath);
    //   // setNavigationPath(vectorLayer);
    // };


    mapRef.current.initLocation = initLocation;


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
// export { drawNavigationPath };
export { initLocation };
