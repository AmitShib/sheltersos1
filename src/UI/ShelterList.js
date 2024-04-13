// ShelterList.js
import React, { useEffect, useState } from 'react';
import jerusShelters from '../GisData/jerusalem.geojson';


const ShelterList = () => {
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

  // Calculate distance between two points
  const calculateDistance = (point1, point2) => {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
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
    <div>
      <h2>List of Closest Shelters</h2>
      <ul>
        {sortedShelters.map((shelter, index) => (
          <li key={index}>
            Shelter Number: {shelter.shelterNumber} - Coordinates: {shelter.coordinates.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShelterList;
