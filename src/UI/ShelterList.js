import { toLonLat } from 'ol/proj';
import React, { useEffect, useState, useContext } from 'react';
import holonShelters from '../GisData/holon.geojson';
import jerusShelters from '../GisData/jerusalem.geojson';
import { initLocation } from '../Map/MapComponent';
import './ShelterList.css';
import { GlobalContext } from '../GlobalContext';
import { toast } from 'react-toastify'; // Import the toast library

const ShelterList = ({ mapRef }) => {
    const [featureCollection, setFeatureCollection] = useState(null);

    const { isConnected } = useContext(GlobalContext);

    console.log("initLoc at ShelterList", initLocation);

    useEffect(() => {
        const fetchGeoJSON = async () => {
            try {
                const responseJerusalem = await fetch(jerusShelters);
                const responseHolon = await fetch(holonShelters);
                const dataJerusalem = await responseJerusalem.json();
                const dataHolon = await responseHolon.json();

                const combinedFeatures = [...dataJerusalem.features, ...dataHolon.features];

                setFeatureCollection({ features: combinedFeatures });
            } catch (error) {
                console.error('Error fetching GeoJSON data:', error);
            }
        };

        fetchGeoJSON();
    }, []);

    const targetPoint = toLonLat(initLocation);

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

    const zoomToShelter = (shelter) => {
        const map = mapRef.current;
        if (map) {
            map.zoomToShelter(shelter);
        }
    };

    const handleReportClick = () => {
        if (!isConnected) {
            toast.error('Please connect first.'); // Display a toast if not connected
            return;
        }
        // Code to handle report click when connected
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
                            <button className="red-ellipse-button" onClick={handleReportClick}>Report</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default ShelterList;
