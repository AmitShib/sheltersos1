// ShelterList.js
import React, { useEffect, useState } from 'react';
import jerusShelters from '../GisData/jerusalem.geojson';
import './ShelterList.css';



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
    //   const calculateDistance = (point1, point2) => {
    //     const [x1, y1] = point1;
    //     const [x2, y2] = point2;
    //     return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    //   };


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

    // Process and sort shelters when featureCollection is available
    const sortedShelters = featureCollection
        ? featureCollection.features.map((feature, index) => ({
            shelterNumber: index + 1,
            // coordinates: feature.geometry.coordinates,
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
                            <button className="red-ellipse-button">Navigation</button>
                            <button className="red-ellipse-button">Report</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default ShelterList;
