import React from 'react';
import './MapHelp.css';


const MapHelp = () => {
    return (
        <div className="map-help-container">
            <div className="map-help">
                <div className="map-help-item">
                    <span className="blue-dot"></span>
                    <span>Current Location</span>
                </div>
                <div className="map-help-item">
                    <span className="red-dot"></span>
                    <span>Reported Shelter</span>
                </div>
                <div className="map-help-item">
                    <span className="green-dot"></span>
                    <span>Regular Shelter</span>
                </div>
            </div>
        </div>
    );
};

export default MapHelp;
