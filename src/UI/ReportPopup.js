import React, { useState } from 'react';
import './ReportPopup.css'; // Add your CSS for styling the pop-up
import axios from 'axios';


const ReportPopup = ({ shelterNumber, onClose, onSubmit, report }) => {

    const [reportText, setReportText] = useState(report ? report : ''); 

    const handleInputChange = (event) => {
        setReportText(event.target.value.slice(0, 30)); // Limiting input to 30 characters
    };

    const handleSubmit = async () => {
        try {
            if (report === null) {
                // If report is null, use POST request to add new report
                await axios.post('http://localhost:3000/api/reports', { shelterNum: shelterNumber, report: reportText });
            } else {
                // If report is not null, use PUT request to update existing report
                await axios.put(`http://localhost:3000/api/reports/${shelterNumber}`, { report: reportText });
            }
            onSubmit(reportText);
            onClose();
        } catch (error) {
            console.error('Error submitting report:', error);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="report-popup-container">
            <div className="report-popup">
                <h2>Shelter Number: {shelterNumber}</h2>
                <textarea
                    className="report-text"
                    value={reportText}
                    onChange={handleInputChange}
                    maxLength={30}
                    placeholder="Enter your report here..."
                />
                <div className="button-container">
                    <button className="submit-button" onClick={handleSubmit}>Submit</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ReportPopup;
