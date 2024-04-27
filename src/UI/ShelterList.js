import { toLonLat } from 'ol/proj';
import React, { useEffect, useState, useContext } from 'react';
import holonShelters from '../GisData/holon.geojson';
import jerusShelters from '../GisData/jerusalem.geojson';
import { initLocation } from '../Map/MapComponent';
import './ShelterList.css';
import { GlobalContext } from '../GlobalContext';
import { toast } from 'react-toastify'; // Import the toast library
import ReportPopup from './ReportPopup';
import axios from 'axios';

const ShelterList = ({ mapRef }) => {
    const [featureCollection, setFeatureCollection] = useState(null);

    const { isConnected } = useContext(GlobalContext);

    const [showReportPopup, setShowReportPopup] = useState(false); // State to manage the visibility of the pop-up
    const [selectedShelter, setSelectedShelter] = useState(null); // State to store the selected shelter

    const [reports, setReports] = useState([]);


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

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/reports');
                const parsedReports = response.data.map(report => ({
                    ...report,
                    shelterNum: parseInt(report.shelterNum, 10) // Parse shelterNum to number
                }));
                setReports(parsedReports);
    
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
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

    const handleReportClick = (shelter) => {
        if (!isConnected) {
            toast.error('Please connect first.'); // Display a toast if not connected
            return;
        } else {
            setSelectedShelter(shelter);
            setShowReportPopup(true);
        }
    };

    const handleCloseReportPopup = () => {
        setShowReportPopup(false);
    };

    const handleSubmitReport = (reportText) => {
        // Code to handle report submission
        console.log("Report submitted:", reportText);
        handleCloseReportPopup();
    };


    // Process and sort shelters when featureCollection is available
    const sortedShelters = featureCollection
        ? featureCollection.features.map((feature, index) => {
            const shelterNumber = index + 1;
            const coordinates = feature.geometry.coordinates;
            const distance = calculateDistance(coordinates, targetPoint);
            const report = reports.find(report => report.shelterNum === shelterNumber); // Find report for the shelterNumber

            return {
                shelterNumber,
                coordinates,
                distance,
                report: report ? report.report : null, // Set report if available, otherwise null
            };
        }).sort((a, b) => a.distance - b.distance).slice(0, 10)
        : [];

    return (
        <div className="shelter-list-container"> {/* Apply the CSS class to the container */}
            <h2>List of Closest Shelters</h2>
            <ul>
                {sortedShelters.map((shelter, index) => (
                    <li key={index} className="shelter-item">
                        <span className="name"> Shelter Number: {shelter.shelterNumber}</span><br />
                        <span className="distance">{shelter.distance.toFixed(2)} meters away</span><br />
                        {shelter.report && <span className="report">report: {shelter.report}</span>}<br />
                        <div className="button-container">
                            <button className="red-ellipse-button" onClick={() => zoomToShelter(shelter)}>Navigation</button>
                            <button className="red-ellipse-button" onClick={() => handleReportClick(shelter)}>Report</button>
                        </div>
                    </li>
                ))}
            </ul>
            {showReportPopup && (
                <ReportPopup
                    shelterNumber={selectedShelter.shelterNumber}
                    onClose={handleCloseReportPopup}
                    onSubmit={handleSubmitReport}
                    report={selectedShelter.report}
                />
            )}

        </div>
    );

};

export default ShelterList;
