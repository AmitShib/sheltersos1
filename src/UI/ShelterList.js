// ShelterList.js
import React, { useEffect, useState } from 'react';
import jerusShelters from '../GisData/jerusalem.geojson';
import './ShelterList.css';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';




const ShelterList = ({ mapRef }) => {
    const [featureCollection, setFeatureCollection] = useState(null);

    useEffect(() => {
        const fetchGeoJSON = async () => {
            try {
                const response = await fetch(jerusShelters);
                const data = await response.json();
                setFeatureCollection(data);
            } catch (error) {
                console.error('Error fetching GeoJSON data:', error);
            }
        };

        fetchGeoJSON();
    }, []);

    const targetPoint = [35.2134, 31.7683];

    const calculateDistance = (point1, point2) => {
        const [lon1, lat1] = point1;
        const [lon2, lat2] = point2;
        const earthRadius = 6371000; // Earth's radius in meters

        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        return distance;
    };

    const pointerSource = new VectorSource();
    const pointerLayer = new VectorLayer({
      source: pointerSource,
      style: new Style({
        image: new Icon({
          src: 'https://cdn.mapmarker.io/api/v1/p/rounded.png',
          scale: 0.5,
        }),
      }),
    });
  

    const zoomToShelter = (shelter) => {
        const map = mapRef.current;
        console.log("coordinates",shelter.coordinates)
        const coordinates = fromLonLat(shelter.coordinates);
        if (map ) {
          map.getView().animate({
            center: coordinates,
            zoom: 15,
            duration: 1000,
          });
          pointerSource.clear();

          // Add new pointer
          const pointerFeature = new Feature({
            geometry: new Point(coordinates),
          });
          pointerSource.addFeature(pointerFeature);
    
        }
      };

    // Process and sort shelters when featureCollection is available
    const sortedShelters = featureCollection
        ? featureCollection.features.map((feature, index) => ({
            shelterNumber: index + 1,
            coordinates: feature.geometry.coordinates,
            distance: calculateDistance(feature.geometry.coordinates, targetPoint),
        })).sort((a, b) => a.distance - b.distance).slice(0, 10)
        : [];

    return (
        <div className="shelter-list-container"> {/* Apply the CSS class to the container */}
            <h2>List of Closest Shelters</h2>
            <ul>
                {sortedShelters.map((shelter, index) => (
                    <li key={index} className="shelter-item"> {/* Apply the CSS class to each shelter item */}
                        <span className="name"> Shelter Number: {shelter.shelterNumber}</span><br />
                        <span className="distance">{shelter.distance.toFixed(2)} meters away</span><br />
                        <div className="button-container">
                            <button className="red-ellipse-button" onClick={() => zoomToShelter(shelter)}>Navigation</button>
                            <button className="red-ellipse-button">Report</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default ShelterList;
